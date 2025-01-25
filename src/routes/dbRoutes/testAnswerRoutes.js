const express = require('express');
const router = express.Router();
const testAnswerController = require('../../controllers/dbControllers/testAnswerController');

router.post('/', testAnswerController.createTestAnswer);
router.get('/', testAnswerController.getTestAnswers);
router.get('/:id', testAnswerController.getTestAnswerById);
router.put('/:id', testAnswerController.updateTestAnswer);
router.delete('/:id', testAnswerController.deleteTestAnswer);

module.exports = router;