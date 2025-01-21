const express = require('express');
const router = express.Router();
const testQuestionController = require('../controllers/testQuestionController');

router.post('/', testQuestionController.createTestQuestion);
router.get('/', testQuestionController.getAllTestQuestions);
router.get('/:id', testQuestionController.getTestQuestionById);
router.put('/:id', testQuestionController.updateTestQuestion);
router.delete('/:id', testQuestionController.deleteTestQuestion);

module.exports = router;