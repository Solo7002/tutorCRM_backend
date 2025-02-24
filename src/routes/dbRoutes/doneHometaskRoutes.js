const express = require('express');
const router = express.Router();
const doneHometaskController = require('../../controllers/dbControllers/doneHometaskController');

/**
 * @swagger
 * tags:
 *   name: DoneHometasks
 *   description: Done Hometasks management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DoneHomeTask:
 *       type: object
 *       properties:
 *         DoneHomeTaskId:
 *           type: integer
 *           description: The auto-generated ID of the done hometask
 *         Mark:
 *           type: integer
 *           description: The mark given for the done hometask
 *         DoneDate:
 *           type: string
 *           format: date
 *           description: The date when the hometask was done
 *         HomeTaskId:
 *           type: integer
 *           description: The ID of the associated hometask
 *         StudentId:
 *           type: integer
 *           description: The ID of the student who completed the hometask
 */

/**
 * @swagger
 * /api/doneHometasks:
 *   post:
 *     summary: Create a new done hometask
 *     tags: [DoneHometasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneHomeTask'
 *     responses:
 *       200:
 *         description: The done hometask was successfully created
 */
router.post('/', doneHometaskController.createDoneHometask);

/**
 * @swagger
 * /api/doneHometasks:
 *   get:
 *     summary: Get all done hometasks
 *     tags: [DoneHometasks]
 *     responses:
 *       200:
 *         description: List of done hometasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoneHomeTask'
 */
router.get('/', doneHometaskController.getDoneHometasks);
router.get('/search', doneHometaskController.searchDoneHomeTasks);

/**
 * @swagger
 * /api/doneHometasks/{id}:
 *   get:
 *     summary: Get a done hometask by ID
 *     tags: [DoneHometasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask ID
 *     responses:
 *       200:
 *         description: Done hometask data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoneHomeTask'
 */
router.get('/:id', doneHometaskController.getDoneHometaskById);

/**
 * @swagger
 * /api/doneHometasks/{id}:
 *   put:
 *     summary: Update a done hometask
 *     tags: [DoneHometasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoneHomeTask'
 *     responses:
 *       200:
 *         description: The done hometask was successfully updated
 */
router.put('/:id', doneHometaskController.updateDoneHometask);

/**
 * @swagger
 * /api/doneHometasks/{id}:
 *   delete:
 *     summary: Delete a done hometask
 *     tags: [DoneHometasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The done hometask ID
 *     responses:
 *       200:
 *         description: The done hometask was successfully deleted
 */
router.delete('/:id', doneHometaskController.deleteDoneHometask);

router.get('/pendingHometask/:studentId', doneHometaskController.getPendingHomeTasksByStudentId);

router.get('/doneHometask/:studentId', doneHometaskController.getCheckedHomeTasksByStudentId);
//отдельная выгрузка таска,для модального окна 
router.get('/checkedHomeTasks/:studentId/:homeTaskId', doneHometaskController.getCheckedHomeTasksByStudentIdAndHometaskId);

module.exports = router;