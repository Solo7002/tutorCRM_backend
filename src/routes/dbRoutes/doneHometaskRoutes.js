const express = require('express');
const router = express.Router();
const doneHometaskController = require('../../controllers/dbControllers/doneHometaskController');

router.post('/', doneHometaskController.createDoneHometask);
router.get('/', doneHometaskController.getDoneHometasks);
router.get('/search', doneHometaskController.searchDoneHomeTasks);
router.get('/:id', doneHometaskController.getDoneHometaskById);
router.put('/:id', doneHometaskController.updateDoneHometask);
router.delete('/:id', doneHometaskController.deleteDoneHometask);

module.exports = router;