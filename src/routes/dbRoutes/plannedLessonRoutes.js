const express = require('express');
const router = express.Router();
const plannedLessonController = require('../../controllers/dbControllers/plannedLessonController');

/**
 * @swagger
 * tags:
 *   name: PlannedLessons
 *   description: Planned Lessons management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlannedLesson:
 *       type: object
 *       properties:
 *         PlannedLessonId:
 *           type: integer
 *           description: The auto-generated ID of the planned lesson
 *         LessonHeader:
 *           type: string
 *           description: The header of the lesson
 *         LessonDescription:
 *           type: string
 *           description: The description of the lesson
 *         LessonPrice:
 *           type: number
 *           format: decimal
 *           description: The price of the lesson
 *         IsPaid:
 *           type: boolean
 *           description: Indicates if the lesson is paid
 *         GroupId:
 *           type: integer
 *           description: The ID of the associated group
 */

/**
 * @swagger
 * /api/plannedLessons:
 *   post:
 *     summary: Create a new planned lesson
 *     tags: [PlannedLessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlannedLesson'
 *     responses:
 *       200:
 *         description: The planned lesson was successfully created
 */
router.post('/', plannedLessonController.createPlannedLesson);

/**
 * @swagger
 * /api/plannedLessons:
 *   get:
 *     summary: Get all planned lessons
 *     tags: [PlannedLessons]
 *     responses:
 *       200:
 *         description: List of planned lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlannedLesson'
 */
router.get('/', plannedLessonController.getPlannedLessons);

/**
 * @swagger
 * /api/plannedLessons/{id}:
 *   get:
 *     summary: Get a planned lesson by ID
 *     tags: [PlannedLessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The planned lesson ID
 *     responses:
 *       200:
 *         description: Planned lesson data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlannedLesson'
 */
router.get('/:id', plannedLessonController.getPlannedLessonById);

/**
 * @swagger
 * /api/plannedLessons/{id}:
 *   put:
 *     summary: Update a planned lesson
 *     tags: [PlannedLessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The planned lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlannedLesson'
 *     responses:
 *       200:
 *         description: The planned lesson was successfully updated
 */
router.put('/:id', plannedLessonController.updatePlannedLesson);

/**
 * @swagger
 * /api/plannedLessons/{id}:
 *   delete:
 *     summary: Delete a planned lesson
 *     tags: [PlannedLessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The planned lesson ID
 *     responses:
 *       200:
 *         description: The planned lesson was successfully deleted
 */
router.delete('/:id', plannedLessonController.deletePlannedLesson);

module.exports = router;