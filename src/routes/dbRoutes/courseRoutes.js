const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/dbControllers/courseController');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Courses management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         CourseId:
 *           type: integer
 *           description: The auto-generated ID of the course
 *         CourseName:
 *           type: string
 *           description: The name of the course
 *         ImageFilePath:
 *           type: string
 *           description: The file path of the course image
 *         TeacherId:
 *           type: integer
 *           description: The ID of the teacher associated with the course
 *         SubjectId:
 *           type: integer
 *           description: The ID of the subject associated with the course
 *         LocationId:
 *           type: integer
 *           description: The ID of the location associated with the course
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully created
 */
router.post('/', courseController.createCourse);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', courseController.getCourses);
router.get('/search', courseController.searchCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully updated
 */
router.put('/:id', courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: The course was successfully deleted
 */
router.delete('/:id', courseController.deleteCourse);

router.get("/courses-by-teacher/:id", courseController.getCoursesByTeacherId)

module.exports = router;