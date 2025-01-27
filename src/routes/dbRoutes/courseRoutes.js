const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/dbControllers/courseController');

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;