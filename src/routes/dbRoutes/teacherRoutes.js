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

module.exports = router;
