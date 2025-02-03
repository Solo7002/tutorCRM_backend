const express = require('express');
const router = express.Router();
const blockedUserController = require('../../controllers/dbControllers/blockedUserController');

/**
 * @swagger
 * tags:
 *   name: BlockedUsers
 *   description: Blocked Users management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlockedUser:
 *       type: object
 *       properties:
 *         BlockedId:
 *           type: integer
 *           description: The auto-generated ID of the blocked user
 *         ReasonDescription:
 *           type: string
 *           description: The reason for blocking the user
 *         BanStartDate:
 *           type: string
 *           format: date
 *           description: The start date of the ban
 *         BanEndDate:
 *           type: string
 *           format: date
 *           description: The end date of the ban
 *         UserId:
 *           type: integer
 *           description: The ID of the user who is blocked
 */

/**
 * @swagger
 * /api/blockedUsers:
 *   post:
 *     summary: Create a new blocked user
 *     tags: [BlockedUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockedUser'
 *     responses:
 *       200:
 *         description: The blocked user was successfully created
 */
router.post('/', blockedUserController.createBlockedUser);

/**
 * @swagger
 * /api/blockedUsers:
 *   get:
 *     summary: Get all blocked users
 *     tags: [BlockedUsers]
 *     responses:
 *       200:
 *         description: List of blocked users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlockedUser'
 */
router.get('/', blockedUserController.getBlockedUsers);

/**
 * @swagger
 * /api/blockedUsers/{id}:
 *   get:
 *     summary: Get a blocked user by ID
 *     tags: [BlockedUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blocked user ID
 *     responses:
 *       200:
 *         description: Blocked user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockedUser'
 */
router.get('/search', blockedUserController.searchBlockedUsers);
router.get('/:id', blockedUserController.getBlockedUserById);

/**
 * @swagger
 * /api/blockedUsers/{id}:
 *   put:
 *     summary: Update a blocked user
 *     tags: [BlockedUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blocked user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockedUser'
 *     responses:
 *       200:
 *         description: The blocked user was successfully updated
 */
router.put('/:id', blockedUserController.updateBlockedUser);

/**
 * @swagger
 * /api/blockedUsers/{id}:
 *   delete:
 *     summary: Delete a blocked user
 *     tags: [BlockedUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The blocked user ID
 *     responses:
 *       200:
 *         description: The blocked user was successfully deleted
 */
router.delete('/:id', blockedUserController.deleteBlockedUser);

module.exports = router;