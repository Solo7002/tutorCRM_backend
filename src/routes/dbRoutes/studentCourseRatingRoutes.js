const express = require('express');
const router = express.Router();
const studentCourseRatingController = require('../../controllers/dbControllers/studentCourseRatingController');

/**
 * @swagger
 * tags:
 *   name: StudentCourseRatings
 *   description: Student Course Ratings management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentCourseRating:
 *       type: object
 *       properties:
 *         Rating:
 *           type: number
 *           format: decimal
 *           description: The rating given by the student for the course
 *         StudentId:
 *           type: integer
 *           description: The ID of the student
 *         CourseId:
 *           type: integer
 *           description: The ID of the course
 */

/**
 * @swagger
 * /api/studentCourseRatings:
 *   post:
 *     summary: Create a new student course rating
 *     tags: [StudentCourseRatings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCourseRating'
 *     responses:
 *       200:
 *         description: The student course rating was successfully created
 */
router.post('/', studentCourseRatingController.createStudentCourseRating);

/**
 * @swagger
 * /api/studentCourseRatings:
 *   get:
 *     summary: Get all student course ratings
 *     tags: [StudentCourseRatings]
 *     responses:
 *       200:
 *         description: List of student course ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentCourseRating'
 */
router.get('/', studentCourseRatingController.getStudentCourseRatings);

/**
 * @swagger
 * /api/studentCourseRatings/{id}:
 *   get:
 *     summary: Get a student course rating by ID
 *     tags: [StudentCourseRatings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student course rating ID
 *     responses:
 *       200:
 *         description: Student course rating data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentCourseRating'
 */
router.get('/:id', studentCourseRatingController.getStudentCourseRatingById);

/**
 * @swagger
 * /api/studentCourseRatings/{id}:
 *   put:
 *     summary: Update a student course rating
 *     tags: [StudentCourseRatings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student course rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentCourseRating'
 *     responses:
 *       200:
 *         description: The student course rating was successfully updated
 */
router.put('/:id', studentCourseRatingController.updateStudentCourseRating);

/**
 * @swagger
 * /api/studentCourseRatings/{id}:
 *   delete:
 *     summary: Delete a student course rating
 *     tags: [StudentCourseRatings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student course rating ID
 *     responses:
 *       200:
 *         description: The student course rating was successfully deleted
 */
router.delete('/:id', studentCourseRatingController.deleteStudentCourseRating);

module.exports = router;