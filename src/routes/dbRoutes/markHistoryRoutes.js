const express = require('express');
const router = express.Router();
const markHistoryController = require('../../controllers/dbControllers/markHistoryController');

/**
 * @swagger
 * tags:
 *   name: MarkHistories
 *   description: Mark Histories management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MarkHistory:
 *       type: object
 *       properties:
 *         MarkId:
 *           type: integer
 *           description: The auto-generated ID of the mark history
 *         Mark:
 *           type: integer
 *           description: The mark given
 *         MarkType:
 *           type: string
 *           description: The type of mark (test or homework)
 *         MarkDate:
 *           type: string
 *           format: date
 *           description: The date when the mark was given
 *         StudentId:
 *           type: integer
 *           description: The ID of the student
 *         CourseId:
 *           type: integer
 *           description: The ID of the course
 */

/**
 * @swagger
 * /api/markHistories:
 *   post:
 *     summary: Create a new mark history
 *     tags: [MarkHistories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkHistory'
 *     responses:
 *       200:
 *         description: The mark history was successfully created
 */
router.post('/', markHistoryController.createMarkHistory);

/**
 * @swagger
 * /api/markHistories:
 *   get:
 *     summary: Get all mark histories
 *     tags: [MarkHistories]
 *     responses:
 *       200:
 *         description: List of mark histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MarkHistory'
 */
router.get('/', markHistoryController.getMarkHistories);
router.get('/search', markHistoryController.searchMarkHistory);

/**
 * @swagger
 * /api/markHistories/{id}:
 *   get:
 *     summary: Get a mark history by ID
 *     tags: [MarkHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The mark history ID
 *     responses:
 *       200:
 *         description: Mark history data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarkHistory'
 */
router.get('/:id', markHistoryController.getMarkHistoryById);

/**
 * @swagger
 * /api/markHistories/{id}:
 *   put:
 *     summary: Update a mark history
 *     tags: [MarkHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The mark history ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkHistory'
 *     responses:
 *       200:
 *         description: The mark history was successfully updated
 */
router.put('/:id', markHistoryController.updateMarkHistory);

/**
 * @swagger
 * /api/markHistories/{id}:
 *   delete:
 *     summary: Delete a mark history
 *     tags: [MarkHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The mark history ID
 *     responses:
 *       200:
 *         description: The mark history was successfully deleted
 */
router.delete('/:id', markHistoryController.deleteMarkHistory);

module.exports = router;