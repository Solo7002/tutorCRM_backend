const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/dbControllers/groupController');

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Groups management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         GroupId:
 *           type: integer
 *           description: The auto-generated ID of the group
 *         GroupName:
 *           type: string
 *           description: The name of the group
 *         GroupPrice:
 *           type: number
 *           format: decimal
 *           description: The price of the group
 *         ImageFilePath:
 *           type: string
 *           description: The file path of the group image
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       200:
 *         description: The group was successfully created
 */
router.post('/', groupController.createGroup);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: List of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */
router.get('/', groupController.getGroups);
router.get('/search', groupController.searchGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     responses:
 *       200:
 *         description: Group data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 */
router.get('/:id', groupController.getGroupById);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       200:
 *         description: The group was successfully updated
 */
router.put('/:id', groupController.updateGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     responses:
 *       200:
 *         description: The group was successfully deleted
 */
router.delete('/:id', groupController.deleteGroup);

router.get("/groups-by-teacher/:id", groupController.getGroupsByTeacherId)
router.get("/groups-by-course/:id", groupController.getGroupsByCourseId)

module.exports = router;