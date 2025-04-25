const express = require('express');
const router = express.Router();
const selectedAnswerController = require('../../controllers/dbControllers/selectedAnswerController');

/**
 * @swagger
 * tags:
 *   name: SelectedAnswers
 *   description: Selected Answers management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SelectedAnswer:
 *       type: object
 *       properties:
 *         SelectedAnswerId:
 *           type: integer
 *           description: The auto-generated ID of the selected answer
 *         TestQuestionId:
 *           type: integer
 *           description: The ID of the associated test question
 *         DoneTestId:
 *           type: integer
 *           description: The ID of the associated done test
 */

/**
 * @swagger
 * /api/selectedAnswers:
 *   post:
 *     summary: Create a new selected answer
 *     tags: [SelectedAnswers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SelectedAnswer'
 *     responses:
 *       200:
 *         description: The selected answer was successfully created
 */
router.post('/', selectedAnswerController.createSelectedAnswer);

/**
 * @swagger
 * /api/selectedAnswers:
 *   get:
 *     summary: Get all selected answers
 *     tags: [SelectedAnswers]
 *     responses:
 *       200:
 *         description: List of selected answers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SelectedAnswer'
 */
router.get('/', selectedAnswerController.getSelectedAnswers);
router.get('/search', selectedAnswerController.searchSelectedAnswers);

/**
 * @swagger
 * /api/selectedAnswers/{id}:
 *   get:
 *     summary: Get a selected answer by ID
 *     tags: [SelectedAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selected answer ID
 *     responses:
 *       200:
 *         description: Selected answer data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SelectedAnswer'
 */
router.get('/:id', selectedAnswerController.getSelectedAnswerById);

/**
 * @swagger
 * /api/selectedAnswers/{id}:
 *   put:
 *     summary: Update a selected answer
 *     tags: [SelectedAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selected answer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SelectedAnswer'
 *     responses:
 *       200:
 *         description: The selected answer was successfully updated
 */
router.put('/:id', selectedAnswerController.updateSelectedAnswer);

/**
 * @swagger
 * /api/selectedAnswers/{id}:
 *   delete:
 *     summary: Delete a selected answer
 *     tags: [SelectedAnswers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The selected answer ID
 *     responses:
 *       200:
 *         description: The selected answer was successfully deleted
 */
router.delete('/:id', selectedAnswerController.deleteSelectedAnswer);

module.exports = router;