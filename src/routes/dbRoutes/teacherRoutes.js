const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/dbControllers/teacherController');

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teachers management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         TeacherId:
 *           type: integer
 *           description: The auto-generated ID of the teacher
 *         AboutTeacher:
 *           type: string
 *           description: Information about the teacher
 *         LessonPrice:
 *           type: integer
 *           description: The price of a lesson
 *         LessonType:
 *           type: string
 *           description: The type of lesson (group or solo)
 *         MeetingType:
 *           type: string
 *           description: The type of meeting (offline or online)
 *         UserId:
 *           type: integer
 *           description: The ID of the associated user
 */

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: The teacher was successfully created
 */
router.post('/', teacherController.createTeacher);

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', teacherController.getTeachers);
router.get('/search', teacherController.searchTeachers);
router.get('/:id/user', teacherController.searchUserByTeacherId);
router.get('/:id/leaders', teacherController.getLeadersByTeacherId);
router.get('/:id/activities', teacherController.getLatestActivitiesByTeacherId);
router.get('/:id/events', teacherController.getEventsByTeacherId);
router.get('/:id/grades', teacherController.getMarksByTeacherId);
router.get('/:id/days', teacherController.getDaysByTeacherId);
router.get('/:id/productivity', teacherController.getProductivityByTeacherId);
router.get('/:id/info', teacherController.getAllAboutTeacher);
router.get('/search/user/:userId', teacherController.getTeacherByUserId);

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */
router.get('/:id', teacherController.getTeacherById);
router.get('/:id/octocoins', teacherController.getTeacherOctoCoinsById);

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: The teacher was successfully updated
 */
router.put('/:id', teacherController.updateTeacher);
router.put('/:id/octocoins', teacherController.updateTeacherOctoCoins);

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: The teacher was successfully deleted
 */
router.delete('/:id', teacherController.deleteTeacher);




router.get('/hometaskTeacher/:teacherId',teacherController.getNameTeacherByIdHometask)
router.put('/profile/:userId', teacherController.updateTeacherProfileByUserId);

module.exports = router;
