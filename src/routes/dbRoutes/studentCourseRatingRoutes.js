const express = require('express');
const router = express.Router();
const studentCourseRatingController = require('../../controllers/dbControllers/studentCourseRatingController');

router.post('/', studentCourseRatingController.createStudentCourseRating);
router.get('/', studentCourseRatingController.getStudentCourseRatings);
router.get('/:id', studentCourseRatingController.getStudentCourseRatingById);
router.put('/:id', studentCourseRatingController.updateStudentCourseRating);
router.delete('/:id', studentCourseRatingController.deleteStudentCourseRating);

module.exports = router;