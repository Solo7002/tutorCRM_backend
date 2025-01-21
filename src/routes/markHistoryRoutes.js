const express = require('express');
const router = express.Router();
const markHistoryController = require('../controllers/markHistoryController');

router.post('/', markHistoryController.createMarkHistory);
router.get('/', markHistoryController.getAllMarkHistories);
router.get('/:id', markHistoryController.getMarkHistoryById);
router.put('/:id', markHistoryController.updateMarkHistory);
router.delete('/:id', markHistoryController.deleteMarkHistory);

module.exports = router;