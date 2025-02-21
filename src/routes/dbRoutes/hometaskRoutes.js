const express = require('express');
const router = express.Router();
const hometaskController = require('../../controllers/dbControllers/hometaskController');

/**
 * @swagger
 * tags:
 *   name: HomeTasks
 *   description: Home Tasks management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HomeTask:
 *       type: object
 *       properties:
 *         HomeTaskId:
 *           type: integer
 *           description: The auto-generated ID of the home task
 *         HomeTaskHeader:
 *           type: string
 *           description: The header of the home task
 *         HomeTaskDescription:
 *           type: string
 *           description: The description of the home task
 *         StartDate:
 *           type: string
 *           format: date
 *           description: The start date of the home task
 *         DeadlineDate:
 *           type: string
 *           format: date
 *           description: The deadline date of the home task
 *         MaxMark:
 *           type: integer
 *           description: The maximum mark for the home task
 *         ImageFilePath:
 *           type: string
 *           description: The file path of the home task image
 *         GroupId:
 *           type: integer
 *           description: The ID of the associated group
 */

/**
 * @swagger
 * /api/hometasks:
 *   post:
 *     summary: Create a new home task
 *     tags: [HomeTasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeTask'
 *     responses:
 *       200:
 *         description: The home task was successfully created
 */
router.post('/', hometaskController.createHomeTask);

/**
 * @swagger
 * /api/hometasks:
 *   get:
 *     summary: Get all home tasks
 *     tags: [HomeTasks]
 *     responses:
 *       200:
 *         description: List of home tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HomeTask'
 */
router.get('/', hometaskController.getHomeTasks);
router.get('/search', hometaskController.searchHomeTasks);

/**
 * @swagger
 * /api/hometasks/{id}:
 *   get:
 *     summary: Get a home task by ID
 *     tags: [HomeTasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task ID
 *     responses:
 *       200:
 *         description: Home task data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeTask'
 */
router.get('/:id', hometaskController.getHomeTaskById);

/**
 * @swagger
 * /api/hometasks/{id}:
 *   put:
 *     summary: Update a home task
 *     tags: [HomeTasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeTask'
 *     responses:
 *       200:
 *         description: The home task was successfully updated
 */
router.put('/:id', hometaskController.updateHomeTask);

/**
 * @swagger
 * /api/hometasks/{id}:
 *   delete:
 *     summary: Delete a home task
 *     tags: [HomeTasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task ID
 *     responses:
 *       200:
 *         description: The home task was successfully deleted
 */
router.delete('/:id', hometaskController.deleteHomeTask);


router.get('/newHometask/:studentId', hometaskController.getNewHomeTasksByStudentId);
module.exports = router;