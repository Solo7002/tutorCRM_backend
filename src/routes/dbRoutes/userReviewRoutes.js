const express = require('express');
const router = express.Router();
const userReviewController = require('../../controllers/dbControllers/userReviewController');

/**
 * @swagger
 * tags:
 *   name: UserReviews
 *   description: User Reviews management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserReview:
 *       type: object
 *       properties:
 *         UserReviewId:
 *           type: integer
 *           description: The auto-generated ID of the user review
 *         ReviewHeader:
 *           type: string
 *           description: The header of the review
 *         ReviewText:
 *           type: string
 *           description: The text of the review
 *         CreateDate:
 *           type: string
 *           format: date
 *           description: The date when the review was created
 *         UserIdFrom:
 *           type: integer
 *           description: The ID of the user who wrote the review
 *         UserIdFor:
 *           type: integer
 *           description: The ID of the user the review is for
 */

/**
 * @swagger
 * /api/userReviews:
 *   post:
 *     summary: Create a new user review
 *     tags: [UserReviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserReview'
 *     responses:
 *       200:
 *         description: The user review was successfully created
 */
router.post('/', userReviewController.createUserReview);

/**
 * @swagger
 * /api/userReviews:
 *   get:
 *     summary: Get all user reviews
 *     tags: [UserReviews]
 *     responses:
 *       200:
 *         description: List of user reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserReview'
 */
router.get('/', userReviewController.getUserReviews);

/**
 * @swagger
 * /api/userReviews/{id}:
 *   get:
 *     summary: Get a user review by ID
 *     tags: [UserReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user review ID
 *     responses:
 *       200:
 *         description: User review data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserReview'
 */
router.get('/:id', userReviewController.getUserReviewById);

/**
 * @swagger
 * /api/userReviews/{id}:
 *   put:
 *     summary: Update a user review
 *     tags: [UserReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserReview'
 *     responses:
 *       200:
 *         description: The user review was successfully updated
 */
router.put('/:id', userReviewController.updateUserReview);

/**
 * @swagger
 * /api/userReviews/{id}:
 *   delete:
 *     summary: Delete a user review
 *     tags: [UserReviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user review ID
 *     responses:
 *       200:
 *         description: The user review was successfully deleted
 */
router.delete('/:id', userReviewController.deleteUserReview);

module.exports = router;