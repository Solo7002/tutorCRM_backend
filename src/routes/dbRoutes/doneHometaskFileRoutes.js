const express = require('express');
const router = express.Router();
const doneHometaskFileController = require('../../controllers/dbControllers/doneHometaskFileController');

/**
 * @swagger
 * tags:
 *   name: DoneHometaskFiles
 *   description: Done Hometask Files management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DoneHomeTaskFile:
 *       type: object
 *       properties:
 *         HometaskFileId:
 *           type: integer
 *           description: The auto-generated ID of the done hometask file
 *         FilePath:
 *           type: string
 *           description: The file path of the done hometask file
 *         FileName:
 *           type: string
 *           description: The name of the file
 *         DoneHomeTaskId:
 *           type: integer
 *           description: The ID of the associated done hometask
 */

/**
 * @swagger
 * /api/doneHometaskFiles:
 *   post:
 *     summary: Create a new done hometask file
 *     tags: [DoneHometaskFiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneHomeTaskFile'
 *     responses:
 *       200:
 *         description: The done hometask file was successfully created
 */
router.post('/', doneHometaskFileController.createDoneHometaskFile);

/**
 * @swagger
 * /api/doneHometaskFiles:
 *   get:
 *     summary: Get all done hometask files
 *     tags: [DoneHometaskFiles]
 *     responses:
 *       200:
 *         description: List of done hometask files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoneHomeTaskFile'
 */
router.get('/', doneHometaskFileController.getDoneHometaskFiles);
router.get('/search', doneHometaskFileController.searchDoneHomeTaskFiles);

/**
 * @swagger
 * /api/doneHometaskFiles/{id}:
 *   get:
 *     summary: Get a done hometask file by ID
 *     tags: [DoneHometaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask file ID
 *     responses:
 *       200:
 *         description: Done hometask file data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoneHomeTaskFile'
 */
router.get('/:id', doneHometaskFileController.getDoneHometaskFileById);

/**
 * @swagger
 * /api/doneHometaskFiles/{id}:
 *   put:
 *     summary: Update a done hometask file
 *     tags: [DoneHometaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneHomeTaskFile'
 *     responses:
 *       200:
 *         description: The done hometask file was successfully updated
 */
router.put('/:id', doneHometaskFileController.updateDoneHometaskFile);

/**
 * @swagger
 * /api/doneHometaskFiles/{id}:
 *   delete:
 *     summary: Delete a done hometask file
 *     tags: [DoneHometaskFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask file ID
 *     responses:
 *       200:
 *         description: The done hometask file was successfully deleted
 */
router.delete('/:id', doneHometaskFileController.deleteDoneHometaskFile);

module.exports = router;