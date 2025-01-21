const express = require('express');
const router = express.Router();
const testAnswerController = require('../controllers/testAnswerController');

router.post('/', testAnswerController.createTestAnswer);
router.get('/', testAnswerController.getAllTestAnswers);
router.get('/:id', testAnswerController.getTestAnswerById);
router.put('/:id', testAnswerController.updateTestAnswer);
router.delete('/:id', testAnswerController.deleteTestAnswer);

module.exports = router;