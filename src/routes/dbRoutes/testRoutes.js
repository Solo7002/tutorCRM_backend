const express = require('express');
const router = express.Router();
const testController = require('../../controllers/dbControllers/testController');

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Tests management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       properties:
 *         TestId:
 *           type: integer
 *           description: The auto-generated ID of the test
 *         TestName:
 *           type: string
 *           description: The name of the test
 *         TestDescription:
 *           type: string
 *           description: The description of the test
 *         CreatedDate:
 *           type: string
 *           format: date
 *           description: The date when the test was created
 *         GroupId:
 *           type: integer
 *           description: The ID of the associated group
 */

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: The test was successfully created
 */
router.post('/', testController.createTest);

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.get('/', testController.getTests);
router.get('/search', testController.searchTests);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test ID
 *     responses:
 *       200:
 *         description: Test data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.get('/:id', testController.getTestById);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Update a test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *     responses:
 *       200:
 *         description: The test was successfully updated
 */
router.put('/:id', testController.updateTest);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete a test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The test ID
 *     responses:
 *       200:
 *         description: The test was successfully deleted
 */
router.delete('/:id', testController.deleteTest);

router.get("/test-info/:id", testController.getTestInfo);

router.get("/tests-by-student/:id", testController.getTestsByStudentId)
router.post("/generate-test-by-AI/", testController.getTestCreatedByAI)

module.exports = router;