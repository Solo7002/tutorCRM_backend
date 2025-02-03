const express = require('express');
const router = express.Router();
const doneTestController = require('../../controllers/dbControllers/doneTestController');

/**
 * @swagger
 * tags:
 *   name: DoneTests
 *   description: Done Tests management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DoneTest:
 *       type: object
 *       properties:
 *         DoneTestId:
 *           type: integer
 *           description: The auto-generated ID of the done test
 *         Mark:
 *           type: integer
 *           description: The mark given for the done test
 *         DoneDate:
 *           type: string
 *           format: date
 *           description: The date when the test was done
 *         SpentTime:
 *           type: string
 *           format: time
 *           description: The time spent on the test
 *         StudentId:
 *           type: integer
 *           description: The ID of the student who completed the test
 *         TestId:
 *           type: integer
 *           description: The ID of the associated test
 */

/**
 * @swagger
 * /api/doneTests:
 *   post:
 *     summary: Create a new done test
 *     tags: [DoneTests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneTest'
 *     responses:
 *       200:
 *         description: The done test was successfully created
 */
router.post('/', doneTestController.createDoneTest);

/**
 * @swagger
 * /api/doneTests:
 *   get:
 *     summary: Get all done tests
 *     tags: [DoneTests]
 *     responses:
 *       200:
 *         description: List of done tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoneTest'
 */
router.get('/', doneTestController.getDoneTests);

/**
 * @swagger
 * /api/doneTests/{id}:
 *   get:
 *     summary: Get a done test by ID
 *     tags: [DoneTests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done test ID
 *     responses:
 *       200:
 *         description: Done test data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoneTest'
 */
router.get('/:id', doneTestController.getDoneTestById);

/**
 * @swagger
 * /api/doneTests/{id}:
 *   put:
 *     summary: Update a done test
 *     tags: [DoneTests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneTest'
 *     responses:
 *       200:
 *         description: The done test was successfully updated
 */
router.put('/:id', doneTestController.updateDoneTest);

/**
 * @swagger
 * /api/doneTests/{id}:
 *   delete:
 *     summary: Delete a done test
 *     tags: [DoneTests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done test ID
 *     responses:
 *       200:
 *         description: The done test was successfully deleted
 */
router.delete('/:id', doneTestController.deleteDoneTest);

module.exports = router;