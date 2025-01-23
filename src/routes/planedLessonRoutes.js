const express = require('express');
const router = express.Router();
const planedLessonController = require('../controllers/planedLessonController');

router.post('/', planedLessonController.createPlanedLesson);
router.get('/', planedLessonController.getPlanedLessons);
router.get('/:id', planedLessonController.getPlanedLessonById);
router.put('/:id', planedLessonController.updatePlanedLesson);
router.delete('/:id', planedLessonController.deletePlanedLesson);

module.exports = router;