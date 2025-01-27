const express = require('express');
const router = express.Router();
const plannedLessonController = require('../../controllers/dbControllers/plannedLessonController');

router.post('/', plannedLessonController.createPlannedLesson);
router.get('/', plannedLessonController.getPlannedLessons);
router.get('/search', plannedLessonController.searchPlannedLessons);
router.get('/:id', plannedLessonController.getPlannedLessonById);
router.put('/:id', plannedLessonController.updatePlannedLesson);
router.delete('/:id', plannedLessonController.deletePlannedLesson);

module.exports = router;