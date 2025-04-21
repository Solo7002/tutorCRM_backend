const express = require('express');
const router = express.Router();
const groupStudentController = require('../../controllers/dbControllers/groupStudentController');

/**
 * @swagger
 * tags:
 *   name: GroupStudents
 *   description: Group Students management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GroupStudent:
 *       type: object
 *       properties:
 *         GroupId:
 *           type: integer
 *           description: The ID of the group
 *         StudentId:
 *           type: integer
 *           description: The ID of the student
 */

/**
 * @swagger
 * /api/groupsStudents:
 *   post:
 *     summary: Add a student to a group
 *     tags: [GroupStudents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupStudent'
 *     responses:
 *       200:
 *         description: The student was successfully added to the group
 */
router.post('/', groupStudentController.createGroupStudent);

/**
 * @swagger
 * /api/groupsStudents:
 *   get:
 *     summary: Get all group students
 *     tags: [GroupStudents]
 *     responses:
 *       200:
 *         description: List of group students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroupStudent'
 */
router.get('/', groupStudentController.getGroupStudents);
router.get('/search', groupStudentController.searchGroupStudents);

/**
 * @swagger
 * /api/groupsStudents/{id}:
 *   get:
 *     summary: Get a group student by ID
 *     tags: [GroupStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group student ID
 *     responses:
 *       200:
 *         description: Group student data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupStudent'
 */
router.get('/:id', groupStudentController.getGroupStudentById);

/**
 * @swagger
 * /api/groupsStudents/{id}:
 *   put:
 *     summary: Update a group student
 *     tags: [GroupStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupStudent'
 *     responses:
 *       200:
 *         description: The group student was successfully updated
 */
router.put('/:id', groupStudentController.updateGroupStudent);

/**
 * @swagger
 * /api/groupsStudents/{id}:
 *   delete:
 *     summary: Remove a student from a group
 *     tags: [GroupStudents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group student ID
 *     responses:
 *       200:
 *         description: The student was successfully removed from the group
 */
router.delete('/:groupid/:studentid', groupStudentController.deleteGroupStudent);

module.exports = router;