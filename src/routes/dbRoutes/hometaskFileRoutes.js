const express = require('express');
const router = express.Router();
const hometaskFileController = require('../../controllers/dbControllers/hometaskFileController');

/**
 * @swagger
 * tags:
 *   name: HomeTaskFiles
 *   description: Home Task Files management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HomeTaskFile:
 *       type: object
 *       properties:
 *         HomeTaskFileId:
 *           type: integer
 *           description: The auto-generated ID of the home task file
 *         FilePath:
 *           type: string
 *           description: The file path of the home task file
 *         FileName:
 *           type: string
 *           description: The name of the file
 *         HomeTaskId:
 *           type: integer
 *           description: The ID of the associated home task
 */

/**
 * @swagger
 * /api/hometaskFiles:
 *   post:
 *     summary: Create a new home task file
 *     tags: [HomeTaskFiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeTaskFile'
 *     responses:
 *       200:
 *         description: The home task file was successfully created
 */
router.post('/', hometaskFileController.createHometaskFile);

/**
 * @swagger
 * /api/hometaskFiles:
 *   get:
 *     summary: Get all home task files
 *     tags: [HomeTaskFiles]
 *     responses:
 *       200:
 *         description: List of home task files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HomeTaskFile'
 */
router.get('/', hometaskFileController.getHometaskFiles);

/**
 * @swagger
 * /api/hometaskFiles/{id}:
 *   get:
 *     summary: Get a home task file by ID
 *     tags: [HomeTaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task file ID
 *     responses:
 *       200:
 *         description: Home task file data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomeTaskFile'
 */
router.get('/:id', hometaskFileController.getHometaskFileById);

/**
 * @swagger
 * /api/hometaskFiles/{id}:
 *   put:
 *     summary: Update a home task file
 *     tags: [HomeTaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomeTaskFile'
 *     responses:
 *       200:
 *         description: The home task file was successfully updated
 */
router.put('/:id', hometaskFileController.updateHometaskFile);

/**
 * @swagger
 * /api/hometaskFiles/{id}:
 *   delete:
 *     summary: Delete a home task file
 *     tags: [HomeTaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The home task file ID
 *     responses:
 *       200:
 *         description: The home task file was successfully deleted
 */
router.delete('/:id', hometaskFileController.deleteHometaskFile);

module.exports = router;