const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/dbControllers/studentController');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Students management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         StudentId:
 *           type: integer
 *           description: The auto-generated ID of the student
 *         SchoolName:
 *           type: string
 *           description: The name of the school the student attends
 *         Grade:
 *           type: string
 *           description: The grade of the student
 *         UserId:
 *           type: integer
 *           description: The ID of the associated user
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: The student was successfully created
 */
router.post('/', studentController.createStudent);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', studentController.getStudents);
router.get('/search', studentController.searchStudents);
router.get('/search-by-user-id/:id', studentController.searchStudentsByUserId);
router.get('/:id/leaders', studentController.getLeadersInGroupsByStudentId);
router.get('/:id/grades', studentController.getMarksByStudentId);
router.get('/:id/events', studentController.getEventsByStudentId);
router.get('/:id/days', studentController.getDaysByStudentId);
router.get('/:id/user', studentController.searchUserByStudentId);
router.get('/searchTeachers', studentController.searchTeachersForStudent);
router.get('/search/user/:userId', studentController.getStudentByUserId);
router.get('/:id/info', studentController.getAllAboutStudent);
router.get('/:id/groups', studentController.getStudentGroups);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.get('/:id', studentController.getStudentById);
router.get('/:id/trophies', studentController.getStudentTrophiesById);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: The student was successfully updated
 */
router.put('/:id', studentController.updateStudent);
router.put('/:id/trophies', studentController.updateStudentTrophiesById);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     responses:
 *       200:
 *         description: The student was successfully deleted
 */
router.delete('/:id', studentController.deleteStudent);

/**
 * @swagger
 * /api/students/user/{userId}:
 *   put:
 *     summary: Update a student profile by user ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   FirstName:
 *                     type: string
 *                   LastName:
 *                     type: string
 *                   Email:
 *                     type: string
 *                   ImageFilePath:
 *                     type: string
 *               student:
 *                 type: object
 *                 properties:
 *                   SchoolName:
 *                     type: string
 *                   Grade:
 *                     type: string
 *               phone:
 *                 type: object
 *                 properties:
 *                   PhoneNumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: The student profile was successfully updated
 */
router.put('/profile/:userId', studentController.updateStudentProfileByUserId);

module.exports = router;