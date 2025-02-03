const express = require('express');
const router = express.Router();
const userComplaintController = require('../../controllers/dbControllers/userComplaintController');

/**
 * @swagger
 * tags:
 *   name: UserComplaints
 *   description: User Complaints management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserComplaint:
 *       type: object
 *       properties:
 *         UserComplaintId:
 *           type: integer
 *           description: The auto-generated ID of the user complaint
 *         ComplaintDate:
 *           type: string
 *           format: date
 *           description: The date when the complaint was made
 *         ComplaintDescription:
 *           type: string
 *           description: The description of the complaint
 *         UserFromId:
 *           type: integer
 *           description: The ID of the user who made the complaint
 *         UserForId:
 *           type: integer
 *           description: The ID of the user the complaint is against
 */

/**
 * @swagger
 * /api/userComplaints:
 *   post:
 *     summary: Create a new user complaint
 *     tags: [UserComplaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserComplaint'
 *     responses:
 *       200:
 *         description: The user complaint was successfully created
 */
router.post('/', userComplaintController.createUserComplaint);

/**
 * @swagger
 * /api/userComplaints:
 *   get:
 *     summary: Get all user complaints
 *     tags: [UserComplaints]
 *     responses:
 *       200:
 *         description: List of user complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserComplaint'
 */
router.get('/', userComplaintController.getUserComplaints);

/**
 * @swagger
 * /api/userComplaints/{id}:
 *   get:
 *     summary: Get a user complaint by ID
 *     tags: [UserComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user complaint ID
 *     responses:
 *       200:
 *         description: User complaint data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserComplaint'
 */
router.get('/:id', userComplaintController.getUserComplaintById);

/**
 * @swagger
 * /api/userComplaints/{id}:
 *   put:
 *     summary: Update a user complaint
 *     tags: [UserComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserComplaint'
 *     responses:
 *       200:
 *         description: The user complaint was successfully updated
 */
router.put('/:id', userComplaintController.updateUserComplaint);

/**
 * @swagger
 * /api/userComplaints/{id}:
 *   delete:
 *     summary: Delete a user complaint
 *     tags: [UserComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user complaint ID
 *     responses:
 *       200:
 *         description: The user complaint was successfully deleted
 */
router.delete('/:id', userComplaintController.deleteUserComplaint);

module.exports = router;