const express = require('express');
const router = express.Router();
const testAnswerController = require('../../controllers/dbControllers/testAnswerController');

/**
 * @swagger
 * tags:
 *   name: TestAnswers
 *   description: Test Answers management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TestAnswer:
 *       type: object
 *       properties:
 *         TestAnswerId:
 *           type: integer
 *           description: The auto-generated ID of the test answer
 *         AnswerText:
 *           type: string
 *           description: The text of the answer
 *         ImagePath:
 *           type: string
 *           description: The file path of the answer image
 *         IsRightAnswer:
 *           type: boolean
 *           description: Indicates if the answer is correct
 *         TestQuestionId:
 *           type: integer
 *           description: The ID of the associated test question
 *         SelectedAnswerId:
 *           type: integer
 *           description: The ID of the associated selected answer
 */

/**
 * @swagger
 * /api/testAnswers:
 *   post:
 *     summary: Create a new test answer
 *     tags: [TestAnswers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestAnswer'
 *     responses:
 *       200:
 *         description: The test answer was successfully created
 */
router.post('/', testAnswerController.createTestAnswer);

/**
 * @swagger
 * /api/testAnswers:
 *   get:
 *     summary: Get all test answers
 *     tags: [TestAnswers]
 *     responses:
 *       200:
 *         description: List of test answers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestAnswer'
 */
router.get('/', testAnswerController.getTestAnswers);
router.get('/search', testAnswerController.searchTestAnswers);

/**
 * @swagger
 * /api/testAnswers/{id}:
 *   get:
 *     summary: Get a test answer by ID
 *     tags: [TestAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test answer ID
 *     responses:
 *       200:
 *         description: Test answer data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestAnswer'
 */
router.get('/:id', testAnswerController.getTestAnswerById);

/**
 * @swagger
 * /api/testAnswers/{id}:
 *   put:
 *     summary: Update a test answer
 *     tags: [TestAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test answer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestAnswer'
 *     responses:
 *       200:
 *         description: The test answer was successfully updated
 */
router.put('/:id', testAnswerController.updateTestAnswer);

/**
 * @swagger
 * /api/testAnswers/{id}:
 *   delete:
 *     summary: Delete a test answer
 *     tags: [TestAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test answer ID
 *     responses:
 *       200:
 *         description: The test answer was successfully deleted
 */
router.delete('/:id', testAnswerController.deleteTestAnswer);

module.exports = router;