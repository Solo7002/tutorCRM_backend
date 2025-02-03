const express = require('express');
const router = express.Router();
const materialVisibilityStudentController = require('../../controllers/dbControllers/materialVisibilityStudentController');

/**
 * @swagger
 * tags:
 *   name: MaterialVisibilityStudents
 *   description: Material Visibility Students management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MaterialVisibilityStudent:
 *       type: object
 *       properties:
 *         MaterialId:
 *           type: integer
 *           description: The ID of the material
 *         StudentId:
 *           type: integer
 *           description: The ID of the student
 */

/**
 * @swagger
 * /api/materialVisibilityStudents:
 *   post:
 *     summary: Create a new material visibility student
 *     tags: [MaterialVisibilityStudents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaterialVisibilityStudent'
 *     responses:
 *       200:
 *         description: The material visibility student was successfully created
 */
router.post('/', materialVisibilityStudentController.createMaterialVisibilityStudent);

/**
 * @swagger
 * /api/materialVisibilityStudents:
 *   get:
 *     summary: Get all material visibility students
 *     tags: [MaterialVisibilityStudents]
 *     responses:
 *       200:
 *         description: List of material visibility students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaterialVisibilityStudent'
 */
router.get('/', materialVisibilityStudentController.getMaterialVisibilityStudents);

/**
 * @swagger
 * /api/materialVisibilityStudents/{id}:
 *   get:
 *     summary: Get a material visibility student by ID
 *     tags: [MaterialVisibilityStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material visibility student ID
 *     responses:
 *       200:
 *         description: Material visibility student data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialVisibilityStudent'
 */
router.get('/:id', materialVisibilityStudentController.getMaterialVisibilityStudentById);

/**
 * @swagger
 * /api/materialVisibilityStudents/{id}:
 *   put:
 *     summary: Update a material visibility student
 *     tags: [MaterialVisibilityStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material visibility student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaterialVisibilityStudent'
 *     responses:
 *       200:
 *         description: The material visibility student was successfully updated
 */
router.put('/:id', materialVisibilityStudentController.updateMaterialVisibilityStudent);

/**
 * @swagger
 * /api/materialVisibilityStudents/{id}:
 *   delete:
 *     summary: Delete a material visibility student
 *     tags: [MaterialVisibilityStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The material visibility student ID
 *     responses:
 *       200:
 *         description: The material visibility student was successfully deleted
 */
router.delete('/:id', materialVisibilityStudentController.deleteMaterialVisibilityStudent);

module.exports = router;