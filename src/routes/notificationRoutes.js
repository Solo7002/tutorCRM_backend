const express = require('express');
const router = express.Router();
const { setCache, getCache, deleteCache, redisClient } = require('../utils/cacheUtils'); // Import Redis utilities
const { createGroupStudentFromNotification, findStudentByUserId } = require('../controllers/dbControllers/groupStudentController'); // Import createGroupStudent controller
const {User, Group, Course} = require('../models/dbModels');

// Endpoint to handle course join requests
router.post('/join', async (req, res) => {
    try {
        const requestData = req.body; // Get data from request body
        // Validate required fields
        if (
            !requestData.studentId ||
            !requestData.groupId ||
            !requestData.studentName ||
            !requestData.courseName ||
            !requestData.groupName ||
            !requestData.date ||
            !requestData.teacherId
        ) {
            return res.status(400).json({
                error: 'Missing required fields: studentId, groupId, studentName, courseName, groupName, date, or teacherId',
            });
        }

        // Add a timestamp to the Redis key to ensure uniqueness
        const timestamp = new Date().getTime();
        const redisKey = `notifications:join:${requestData.studentId}:${requestData.groupId}:${timestamp}`;
        const ttl = 60 * 60 * 24 * 7; // 7 days

        // Save the notification data in Redis
        await setCache(redisKey, requestData, ttl);

        // Add the notification key to the teacher's notification list
        const teacherNotificationList = `notifications:join:teacher:${requestData.teacherId}`;
        await redisClient.lPush(teacherNotificationList, redisKey); // Changed lpush to lPush

        // Send success response to the client
        res.status(200).json({ message: 'Notification successfully saved in Redis', key: redisKey });
    } catch (err) {
        console.error('Error saving to Redis:', err);
        res.status(500).json({ error: 'Server error while saving notification' });
    }
});

// Endpoint to get all notifications for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacherNotificationList = `notifications:join:teacher:${teacherId}`;

        // Get all notification keys for the teacher
        const notificationKeys = await redisClient.lRange(teacherNotificationList, 0, -1); // Changed lrange to lRange
        if (!notificationKeys || notificationKeys.length === 0) {
            return res.status(200).json({ message: 'No notifications found for this teacher', notifications: [] });
        }

        // Retrieve all notifications
        const notifications = [];
        for (const key of notificationKeys) {
            const notification = await getCache(key);
            if (notification) {
                notifications.push({ key, ...notification });
            } else {
                // If the notification has expired or was deleted, remove the key from the list
                await redisClient.lRem(teacherNotificationList, 0, key); // Changed lrem to lRem
            }
        }

        res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
    } catch (err) {
        console.error('Error retrieving notifications for teacher from Redis:', err);
        res.status(500).json({ error: 'Server error while retrieving notifications' });
    }
});

router.delete('/join/:studentId/:groupId/:timestamp', async (req, res) => {
    try {
        const { studentId, groupId, timestamp } = req.params;
        const { teacherId } = req.query;
        const redisKey = `notifications:join:${studentId}:${groupId}:${timestamp}`;
        const ttl = 60 * 60 * 24 * 7; // 7 days

        // Retrieve the notification to ensure it exists
        const notification = await getCache(redisKey);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Fetch teacher and group details for the rejection notification
        const teacher = await User.findByPk(teacherId);
        const group = await Group.findByPk(groupId);
        const course = await Course.findOne({ where: { CourseId: group.CourseId } });

        if (!teacher || !group || !course) {
            throw new Error('Teacher, group, or course not found');
        }

        // Delete the notification from Redis
        await deleteCache(redisKey);

        // Remove the key from the teacher's notification list
        if (teacherId) {
            if (!redisClient || !redisClient.isOpen) {
                throw new Error('Redis client is not connected');
            }
            const teacherNotificationList = `notifications:join:teacher:${teacherId}`;
            await redisClient.lRem(teacherNotificationList, 0, redisKey);
        }

        // Send rejection notification to the student
        const studentNotificationList = `notifications:student:${studentId}`;
        const rejectionMessage = `Ваш запит на приєднання до курсу "${course.CourseName}" (група: ${group.GroupName}) було відхилено викладачем ${teacher.FirstName} ${teacher.LastName}.`;
        const studentNotificationKey = `notifications:rejection:${studentId}:${groupId}:${timestamp}`;
        await setCache(studentNotificationKey, { message: rejectionMessage, date: new Date().toISOString() }, ttl);
        await redisClient.lPush(studentNotificationList, studentNotificationKey);

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting notification from Redis:', err);
        res.status(500).json({ error: 'Server error while deleting notification' });
    }
});

// Endpoint to accept a join request (delete notification and add student to group)
router.post('/accept/:studentId/:groupId/:timestamp', async (req, res) => {
    try {
        const { studentId, groupId, timestamp } = req.params;
        const { teacherId } = req.body;
        const redisKey = `notifications:join:${studentId}:${groupId}:${timestamp}`;

        // Retrieve the notification to ensure it exists
        const notification = await getCache(redisKey);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Find the StudentId by UserId (studentId is actually UserId)
        const actualStudentId = await findStudentByUserId(studentId);
        if (!actualStudentId) {
            return res.status(404).json({ error: 'Student not found for the given user ID' });
        }

        // Fetch teacher and group details for the acceptance notification
        const teacher = await User.findByPk(teacherId);
        const group = await Group.findByPk(groupId);
        const course = await Course.findOne({ where: { CourseId: group.CourseId } });

        if (!teacher || !group || !course) {
            throw new Error('Teacher, group, or course not found');
        }

        // Add the student to the group
        const groupStudentData = {
            StudentId: actualStudentId,
            GroupId: groupId,
            JoinDate: new Date(),
        };

        await createGroupStudentFromNotification(groupStudentData);

        // Delete the notification from Redis
        await deleteCache(redisKey);

        // Remove the key from the teacher's notification list
        if (teacherId) {
            if (!redisClient || !redisClient.isOpen) {
                throw new Error('Redis client is not connected');
            }
            const teacherNotificationList = `notifications:join:teacher:${teacherId}`;
            await redisClient.lRem(teacherNotificationList, 0, redisKey);
        }

        // Send acceptance notification to the student
        const studentNotificationList = `notifications:student:${studentId}`;
        const acceptanceMessage = `Ваш запит на приєднання до курсу "${course.CourseName}" (група: ${group.GroupName}) було прийнято викладачем ${teacher.FirstName} ${teacher.LastName}.`;
        const studentNotificationKey = `notifications:acceptance:${studentId}:${groupId}:${timestamp}`;
        const ttl = 60 * 60 * 24 * 7; // 7 days
        await setCache(studentNotificationKey, { message: acceptanceMessage, date: new Date().toISOString() }, ttl);
        await redisClient.lPush(studentNotificationList, studentNotificationKey);

        res.status(200).json({ message: 'Join request accepted, student added to group, and notification deleted' });
    } catch (err) {
        console.error('Error accepting join request:', err);

        if (err.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ error: `Cannot add student to group: ${err.message}` });
        }

        res.status(500).json({ error: 'Server error while accepting join request' });
    }
});

// Endpoint to get all notifications for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const studentNotificationList = `notifications:student:${studentId}`;

        if (!redisClient || !redisClient.isOpen) {
            throw new Error('Redis client is not connected');
        }

        const notificationKeys = await redisClient.lRange(studentNotificationList, 0, -1);
        if (!notificationKeys || notificationKeys.length === 0) {
            return res.status(200).json({ message: 'No notifications found for this student', notifications: [] });
        }

        const notifications = [];
        for (const key of notificationKeys) {
            const notification = await getCache(key);
            if (notification) {
                notifications.push({ key, ...notification });
            } else {
                await redisClient.lRem(studentNotificationList, 0, key);
            }
        }

        res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
    } catch (err) {
        console.error('Error retrieving notifications for student from Redis:', err);
        res.status(500).json({ error: 'Server error while retrieving notifications' });
    }
});

router.delete('/student/:studentId/:notificationKey', async (req, res) => {
    try {
        const { studentId, notificationKey } = req.params;
        const studentNotificationList = `notifications:student:${studentId}`;

        if (!redisClient || !redisClient.isOpen) {
            throw new Error('Redis client is not connected');
        }

        // Удаляем уведомление из Redis
        await deleteCache(notificationKey);

        // Удаляем ключ уведомления из списка студента
        await redisClient.lRem(studentNotificationList, 0, notificationKey);

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting student notification from Redis:', err);
        res.status(500).json({ error: 'Server error while deleting notification' });
    }
});

module.exports = router;