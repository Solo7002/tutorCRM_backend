const express = require('express');
const router = express.Router();
const userPhoneController = require('../../controllers/dbControllers/userPhoneController');

/**
 * @swagger
 * tags:
 *   name: UserPhones
 *   description: User Phones management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPhone:
 *       type: object
 *       properties:
 *         UserPhoneId:
 *           type: integer
 *           description: The auto-generated ID of the user phone
 *         PhoneNumber:
 *           type: string
 *           description: The phone number of the user
 *         NickName:
 *           type: string
 *           description: The nickname associated with the phone number
 *         SocialNetworkName:
 *           type: string
 *           description: The social network name associated with the phone number
 *         UserId:
 *           type: integer
 *           description: The ID of the associated user
 */

/**
 * @swagger
 * /api/userPhones:
 *   post:
 *     summary: Create a new user phone
 *     tags: [UserPhones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPhone'
 *     responses:
 *       200:
 *         description: The user phone was successfully created
 */
router.post('/', userPhoneController.createUserPhone);

/**
 * @swagger
 * /api/userPhones:
 *   get:
 *     summary: Get all user phones
 *     tags: [UserPhones]
 *     responses:
 *       200:
 *         description: List of user phones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPhone'
 */
router.get('/', userPhoneController.getUserPhones);

/**
 * @swagger
 * /api/userPhones/{id}:
 *   get:
 *     summary: Get a user phone by ID
 *     tags: [UserPhones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user phone ID
 *     responses:
 *       200:
 *         description: User phone data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPhone'
 */
router.get('/:id', userPhoneController.getUserPhoneById);

/**
 * @swagger
 * /api/userPhones/{id}:
 *   put:
 *     summary: Update a user phone
 *     tags: [UserPhones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user phone ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPhone'
 *     responses:
 *       200:
 *         description: The user phone was successfully updated
 */
router.put('/:id', userPhoneController.updateUserPhone);

/**
 * @swagger
 * /api/userPhones/{id}:
 *   delete:
 *     summary: Delete a user phone
 *     tags: [UserPhones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user phone ID
 *     responses:
 *       200:
 *         description: The user phone was successfully deleted
 */
router.delete('/:id', userPhoneController.deleteUserPhone);

module.exports = router;