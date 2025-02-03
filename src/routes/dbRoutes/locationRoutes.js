const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/dbControllers/locationController');

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Locations management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         LocationId:
 *           type: integer
 *           description: The auto-generated ID of the location
 *         City:
 *           type: string
 *           description: The city of the location
 *         Country:
 *           type: string
 *           description: The country of the location
 *         Latitude:
 *           type: number
 *           format: float
 *           description: The latitude of the location
 *         Longitude:
 *           type: number
 *           format: float
 *           description: The longitude of the location
 *         Address:
 *           type: string
 *           description: The address of the location
 */

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: The location was successfully created
 */
router.post('/', locationController.createLocation);

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get('/', locationController.getLocations);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The location ID
 *     responses:
 *       200:
 *         description: Location data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 */
router.get('/:id', locationController.getLocationById);

/**
 * @swagger
 * /api/locations/{id}:
 *   put:
 *     summary: Update a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: The location was successfully updated
 */
router.put('/:id', locationController.updateLocation);

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     summary: Delete a location
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The location ID
 *     responses:
 *       200:
 *         description: The location was successfully deleted
 */
router.delete('/:id', locationController.deleteLocation);

module.exports = router;