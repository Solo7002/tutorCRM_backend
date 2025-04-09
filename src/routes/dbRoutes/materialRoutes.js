const express = require('express');
const multer = require('multer');
const router = express.Router();
const materialController = require('../../controllers/dbControllers/materialController');
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Materials management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       properties:
 *         MaterialId:
 *           type: integer
 *           description: The auto-generated ID of the material
 *         MaterialName:
 *           type: string
 *           description: The name of the material
 *         Type:
 *           type: string
 *           description: The type of the material (file or folder)
 *         ParentId:
 *           type: integer
 *           description: The ID of the parent material
 *         TeacherId:
 *           type: integer
 *           description: The ID of the teacher associated with the material
 */

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Create a new material
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: The material was successfully created
 */
router.post('/', upload.single('file'), materialController.createMaterial);

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Get all materials
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: List of materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Material'
 */
router.get('/', materialController.getMaterials);
router.get('/search', materialController.searchMaterials);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Get a material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material ID
 *     responses:
 *       200:
 *         description: Material data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */
router.get('/:id', materialController.getMaterialById);
router.get('/getByUserId/:id', materialController.getMaterialByUserId);
router.get('/getMaterialsByStudentUserId/:id', materialController.getMaterialsByStudentUserId);
router.get('/studentsByMaterial/:id', materialController.getstudentsByMaterialId);
router.put('/setAccessToMaterial/:id', materialController.setAccessToMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Update a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: The material was successfully updated
 */
router.put('/:id', materialController.updateMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material ID
 *     responses:
 *       200:
 *         description: The material was successfully deleted
 */
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;