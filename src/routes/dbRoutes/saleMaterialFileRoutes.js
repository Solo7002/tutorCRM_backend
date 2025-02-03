const express = require('express');
const router = express.Router();
const saleMaterialFileController = require('../../controllers/dbControllers/saleMaterialFileController');

/**
 * @swagger
 * tags:
 *   name: SaleMaterialFiles
 *   description: Sale Material Files management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleMaterialFile:
 *       type: object
 *       properties:
 *         SaleMaterialFileId:
 *           type: integer
 *           description: The auto-generated ID of the sale material file
 *         FilePath:
 *           type: string
 *           description: The file path of the sale material file
 *         FileName:
 *           type: string
 *           description: The name of the file
 *         AppearedDate:
 *           type: string
 *           format: date
 *           description: The date when the file appeared
 *         SaleMaterialId:
 *           type: integer
 *           description: The ID of the associated sale material
 *         PurchasedMaterialId:
 *           type: integer
 *           description: The ID of the associated purchased material
 */

/**
 * @swagger
 * /api/saleMaterialFiles:
 *   post:
 *     summary: Create a new sale material file
 *     tags: [SaleMaterialFiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleMaterialFile'
 *     responses:
 *       200:
 *         description: The sale material file was successfully created
 */
router.post('/', saleMaterialFileController.createSaleMaterialFile);

/**
 * @swagger
 * /api/saleMaterialFiles:
 *   get:
 *     summary: Get all sale material files
 *     tags: [SaleMaterialFiles]
 *     responses:
 *       200:
 *         description: List of sale material files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleMaterialFile'
 */
router.get('/', saleMaterialFileController.getSaleMaterialFiles);
router.get('/search', saleMaterialFileController.searchSaleMaterialFiles);

/**
 * @swagger
 * /api/saleMaterialFiles/{id}:
 *   get:
 *     summary: Get a sale material file by ID
 *     tags: [SaleMaterialFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material file ID
 *     responses:
 *       200:
 *         description: Sale material file data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleMaterialFile'
 */
router.get('/:id', saleMaterialFileController.getSaleMaterialFileById);

/**
 * @swagger
 * /api/saleMaterialFiles/{id}:
 *   put:
 *     summary: Update a sale material file
 *     tags: [SaleMaterialFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleMaterialFile'
 *     responses:
 *       200:
 *         description: The sale material file was successfully updated
 */
router.put('/:id', saleMaterialFileController.updateSaleMaterialFile);

/**
 * @swagger
 * /api/saleMaterialFiles/{id}:
 *   delete:
 *     summary: Delete a sale material file
 *     tags: [SaleMaterialFiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material file ID
 *     responses:
 *       200:
 *         description: The sale material file was successfully deleted
 */
router.delete('/:id', saleMaterialFileController.deleteSaleMaterialFile);

module.exports = router;