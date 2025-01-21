const express = require('express');
const router = express.Router();
const hometaskFileController = require('../controllers/hometaskFileController');

router.post('/', hometaskFileController.createHometaskFile);
router.get('/', hometaskFileController.getAllHometaskFiles);
router.get('/:id', hometaskFileController.getHometaskFileById);
router.put('/:id', hometaskFileController.updateHometaskFile);
router.delete('/:id', hometaskFileController.deleteHometaskFile);

module.exports = router;