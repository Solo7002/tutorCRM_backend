const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/dbControllers/subscriptionController');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscriptions management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         SubscriptionLevelId:
 *           type: integer
 *           description: The auto-generated ID of the subscription level
 *         SubscriptionName:
 *           type: string
 *           description: The name of the subscription
 *         SubscriptionDescription:
 *           type: string
 *           description: The description of the subscription
 *         SubscriptionPrice:
 *           type: number
 *           format: decimal
 *           description: The price of the subscription
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The subscription was successfully created
 */
router.post('/', subscriptionController.createSubscription);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
router.get('/', subscriptionController.getSubscriptions);
router.get('/search', subscriptionController.searchSubscriptions);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The subscription ID
 *     responses:
 *       200:
 *         description: Subscription data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 */
router.get('/:id', subscriptionController.getSubscriptionById);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: The subscription was successfully updated
 */
router.put('/:id', subscriptionController.updateSubscription);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The subscription ID
 *     responses:
 *       200:
 *         description: The subscription was successfully deleted
 */
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;