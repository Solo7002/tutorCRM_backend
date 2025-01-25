const express = require('express');
const router = express.Router();
const testQuestionController = require('../../controllers/dbControllers/testQuestionController');

router.post('/', testQuestionController.createTestQuestion);
router.get('/', testQuestionController.getTestQuestions);
router.get('/:id', testQuestionController.getTestQuestionById);
router.put('/:id', testQuestionController.updateTestQuestion);
router.delete('/:id', testQuestionController.deleteTestQuestion);

module.exports = router;