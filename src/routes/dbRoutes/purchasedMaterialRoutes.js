const express = require('express');
const router = express.Router();
const purchasedMaterialController = require('../../controllers/dbControllers/purchasedMaterialController');

/**
 * @swagger
 * tags:
 *   name: PurchasedMaterials
 *   description: Purchased Materials management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchasedMaterial:
 *       type: object
 *       properties:
 *         PurchasedMaterialId:
 *           type: integer
 *           description: The auto-generated ID of the purchased material
 *         PurchasedDate:
 *           type: string
 *           format: date
 *           description: The date when the material was purchased
 *         SaleMaterialId:
 *           type: integer
 *           description: The ID of the sale material
 *         PurchaserId:
 *           type: integer
 *           description: The ID of the purchaser
 */

/**
 * @swagger
 * /api/purchasedMaterials:
 *   post:
 *     summary: Create a new purchased material
 *     tags: [PurchasedMaterials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchasedMaterial'
 *     responses:
 *       200:
 *         description: The purchased material was successfully created
 */
router.post('/', purchasedMaterialController.createPurchasedMaterial);

/**
 * @swagger
 * /api/purchasedMaterials:
 *   get:
 *     summary: Get all purchased materials
 *     tags: [PurchasedMaterials]
 *     responses:
 *       200:
 *         description: List of purchased materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchasedMaterial'
 */
router.get('/', purchasedMaterialController.getPurchasedMaterials);
router.get('/search', purchasedMaterialController.searchPurchasedMaterials);

/**
 * @swagger
 * /api/purchasedMaterials/{id}:
 *   get:
 *     summary: Get a purchased material by ID
 *     tags: [PurchasedMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The purchased material ID
 *     responses:
 *       200:
 *         description: Purchased material data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchasedMaterial'
 */
router.get('/:id', purchasedMaterialController.getPurchasedMaterialById);

/**
 * @swagger
 * /api/purchasedMaterials/{id}:
 *   put:
 *     summary: Update a purchased material
 *     tags: [PurchasedMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The purchased material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchasedMaterial'
 *     responses:
 *       200:
 *         description: The purchased material was successfully updated
 */
router.put('/:id', purchasedMaterialController.updatePurchasedMaterial);

/**
 * @swagger
 * /api/purchasedMaterials/{id}:
 *   delete:
 *     summary: Delete a purchased material
 *     tags: [PurchasedMaterials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The purchased material ID
 *     responses:
 *       200:
 *         description: The purchased material was successfully deleted
 */
router.delete('/:id', purchasedMaterialController.deletePurchasedMaterial);

module.exports = router;