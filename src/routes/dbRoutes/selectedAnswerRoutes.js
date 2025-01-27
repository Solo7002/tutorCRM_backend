const express = require('express');
const router = express.Router();
const selectedAnswerController = require('../../controllers/dbControllers/selectedAnswerController');

router.post('/', selectedAnswerController.createSelectedAnswer);
router.get('/', selectedAnswerController.getSelectedAnswers);
router.get('/search', selectedAnswerController.searchSelectedAnswers);
router.get('/:id', selectedAnswerController.getSelectedAnswerById);
router.put('/:id', selectedAnswerController.updateSelectedAnswer);
router.delete('/:id', selectedAnswerController.deleteSelectedAnswer);

module.exports = router;