const express = require('express');
const router = express.Router();
const hometaskController = require('../../controllers/dbControllers/hometaskController');

router.post('/', hometaskController.createHomeTask);
router.get('/', hometaskController.getHomeTasks);
router.get('/search', hometaskController.searchHomeTasks);
router.get('/:id', hometaskController.getHomeTaskById);
router.put('/:id', hometaskController.updateHomeTask);
router.delete('/:id', hometaskController.deleteHomeTask);

module.exports = router;