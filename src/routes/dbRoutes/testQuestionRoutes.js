const express = require('express');
const router = express.Router();
const testQuestionController = require('../../controllers/dbControllers/testQuestionController');

/**
 * @swagger
 * tags:
 *   name: TestQuestions
 *   description: Test Questions management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TestQuestion:
 *       type: object
 *       properties:
 *         TestQuestionId:
 *           type: integer
 *           description: The auto-generated ID of the test question
 *         TestQuestionHeader:
 *           type: string
 *           description: The header of the test question
 *         TestQuestionDescription:
 *           type: string
 *           description: The description of the test question
 *         ImagePath:
 *           type: string
 *           description: The file path of the question image
 *         AudioPath:
 *           type: string
 *           description: The file path of the question audio
 *         TestId:
 *           type: integer
 *           description: The ID of the associated test
 */

/**
 * @swagger
 * /api/testQuestions:
 *   post:
 *     summary: Create a new test question
 *     tags: [TestQuestions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestQuestion'
 *     responses:
 *       200:
 *         description: The test question was successfully created
 */
router.post('/', testQuestionController.createTestQuestion);

/**
 * @swagger
 * /api/testQuestions:
 *   get:
 *     summary: Get all test questions
 *     tags: [TestQuestions]
 *     responses:
 *       200:
 *         description: List of test questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestQuestion'
 */
router.get('/', testQuestionController.getTestQuestions);
router.get('/search', testQuestionController.searchTestQuestions);

/**
 * @swagger
 * /api/testQuestions/{id}:
 *   get:
 *     summary: Get a test question by ID
 *     tags: [TestQuestions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test question ID
 *     responses:
 *       200:
 *         description: Test question data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestQuestion'
 */
router.get('/:id', testQuestionController.getTestQuestionById);

/**
 * @swagger
 * /api/testQuestions/{id}:
 *   put:
 *     summary: Update a test question
 *     tags: [TestQuestions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestQuestion'
 *     responses:
 *       200:
 *         description: The test question was successfully updated
 */
router.put('/:id', testQuestionController.updateTestQuestion);

/**
 * @swagger
 * /api/testQuestions/{id}:
 *   delete:
 *     summary: Delete a test question
 *     tags: [TestQuestions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test question ID
 *     responses:
 *       200:
 *         description: The test question was successfully deleted
 */
router.delete('/:id', testQuestionController.deleteTestQuestion);

module.exports = router;