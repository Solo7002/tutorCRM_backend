const express = require('express');
const router = express.Router();
const markHistoryController = require('../../controllers/dbControllers/markHistoryController');

router.post('/', markHistoryController.createMarkHistory);
router.get('/', markHistoryController.getMarkHistories);
router.get('/:id', markHistoryController.getMarkHistoryById);
router.put('/:id', markHistoryController.updateMarkHistory);
router.delete('/:id', markHistoryController.deleteMarkHistory);

module.exports = router;