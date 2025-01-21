const express = require('express');
const router = express.Router();
const doneTestController = require('../controllers/doneTestController');

router.post('/', doneTestController.createDoneTest);
router.get('/', doneTestController.getAllDoneTests);
router.get('/:id', doneTestController.getDoneTestById);
router.put('/:id', doneTestController.updateDoneTest);
router.delete('/:id', doneTestController.deleteDoneTest);

module.exports = router;