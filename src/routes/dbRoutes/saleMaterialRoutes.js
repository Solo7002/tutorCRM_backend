const express = require('express');
const router = express.Router();
const saleMaterialController = require('../../controllers/dbControllers/saleMaterialController');

/**
 * @swagger
 * tags:
 *   name: SaleMaterials
 *   description: Sale Materials management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleMaterial:
 *       type: object
 *       properties:
 *         SaleMaterialId:
 *           type: integer
 *           description: The auto-generated ID of the sale material
 *         MaterialsHeader:
 *           type: string
 *           description: The header of the materials
 *         MaterialsDescription:
 *           type: string
 *           description: The description of the materials
 *         CreatedDate:
 *           type: string
 *           format: date
 *           description: The date when the materials were created
 *         PreviewImagePath:
 *           type: string
 *           description: The file path of the preview image
 *         Price:
 *           type: number
 *           format: decimal
 *           description: The price of the materials
 *         VendorldId:
 *           type: integer
 *           description: The ID of the vendor
 */

/**
 * @swagger
 * /api/saleMaterials:
 *   post:
 *     summary: Create a new sale material
 *     tags: [SaleMaterials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleMaterial'
 *     responses:
 *       200:
 *         description: The sale material was successfully created
 */
router.post('/', saleMaterialController.createSaleMaterial);

/**
 * @swagger
 * /api/saleMaterials:
 *   get:
 *     summary: Get all sale materials
 *     tags: [SaleMaterials]
 *     responses:
 *       200:
 *         description: List of sale materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleMaterial'
 */
router.get('/', saleMaterialController.getSaleMaterials);
router.get('/search', saleMaterialController.searchSaleMaterials);

/**
 * @swagger
 * /api/saleMaterials/{id}:
 *   get:
 *     summary: Get a sale material by ID
 *     tags: [SaleMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material ID
 *     responses:
 *       200:
 *         description: Sale material data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleMaterial'
 */
router.get('/:id', saleMaterialController.getSaleMaterialById);

/**
 * @swagger
 * /api/saleMaterials/{id}:
 *   put:
 *     summary: Update a sale material
 *     tags: [SaleMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleMaterial'
 *     responses:
 *       200:
 *         description: The sale material was successfully updated
 */
router.put('/:id', saleMaterialController.updateSaleMaterial);

/**
 * @swagger
 * /api/saleMaterials/{id}:
 *   delete:
 *     summary: Delete a sale material
 *     tags: [SaleMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The sale material ID
 *     responses:
 *       200:
 *         description: The sale material was successfully deleted
 */
router.delete('/:id', saleMaterialController.deleteSaleMaterial);

module.exports = router;