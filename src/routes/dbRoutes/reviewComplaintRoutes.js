const express = require('express');
const router = express.Router();
const reviewComplaintController = require('../../controllers/dbControllers/reviewComplaintController');

/**
 * @swagger
 * tags:
 *   name: ReviewComplaints
 *   description: Review Complaints management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReviewComplaint:
 *       type: object
 *       properties:
 *         ReviewComplaintId:
 *           type: integer
 *           description: The auto-generated ID of the review complaint
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
 *         ReviewId:
 *           type: integer
 *           description: The ID of the review being complained about
 */

/**
 * @swagger
 * /api/reviewComplaints:
 *   post:
 *     summary: Create a new review complaint
 *     tags: [ReviewComplaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewComplaint'
 *     responses:
 *       200:
 *         description: The review complaint was successfully created
 */
router.post('/', reviewComplaintController.createReviewComplaint);

/**
 * @swagger
 * /api/reviewComplaints:
 *   get:
 *     summary: Get all review complaints
 *     tags: [ReviewComplaints]
 *     responses:
 *       200:
 *         description: List of review complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReviewComplaint'
 */
router.get('/', reviewComplaintController.getReviewComplaints);

/**
 * @swagger
 * /api/reviewComplaints/{id}:
 *   get:
 *     summary: Get a review complaint by ID
 *     tags: [ReviewComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The review complaint ID
 *     responses:
 *       200:
 *         description: Review complaint data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewComplaint'
 */
router.get('/:id', reviewComplaintController.getReviewComplaintById);

/**
 * @swagger
 * /api/reviewComplaints/{id}:
 *   put:
 *     summary: Update a review complaint
 *     tags: [ReviewComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The review complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewComplaint'
 *     responses:
 *       200:
 *         description: The review complaint was successfully updated
 */
router.put('/:id', reviewComplaintController.updateReviewComplaint);

/**
 * @swagger
 * /api/reviewComplaints/{id}:
 *   delete:
 *     summary: Delete a review complaint
 *     tags: [ReviewComplaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The review complaint ID
 *     responses:
 *       200:
 *         description: The review complaint was successfully deleted
 */
router.delete('/:id', reviewComplaintController.deleteReviewComplaint);

module.exports = router;