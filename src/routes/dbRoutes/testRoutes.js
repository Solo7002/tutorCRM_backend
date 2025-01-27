const express = require('express');
const router = express.Router();
const testController = require('../../controllers/dbControllers/testController');

router.post('/', testController.createTest);
router.get('/', testController.getTests);
router.get('/search', testController.searchTests);
router.get('/:id', testController.getTestById);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

module.exports = router;