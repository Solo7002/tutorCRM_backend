const express = require('express');
const router = express.Router();
const doneHometaskFileController = require('../controllers/doneHometaskFileController');

router.post('/', doneHometaskFileController.createDoneHometaskFile);
router.get('/', doneHometaskFileController.getDoneHometaskFiles);
router.get('/:id', doneHometaskFileController.getDoneHometaskFileById);
router.put('/:id', doneHometaskFileController.updateDoneHometaskFile);
router.delete('/:id', doneHometaskFileController.deleteDoneHometaskFile);

module.exports = router;