const express = require('express');
const router = express.Router();
const selectedAnswerController = require('../controllers/selectedAnswerController');

router.post('/', selectedAnswerController.createSelectedAnswer);
router.get('/', selectedAnswerController.getAllSelectedAnswers);
router.get('/:id', selectedAnswerController.getSelectedAnswerById);
router.put('/:id', selectedAnswerController.updateSelectedAnswer);
router.delete('/:id', selectedAnswerController.deleteSelectedAnswer);

module.exports = router;