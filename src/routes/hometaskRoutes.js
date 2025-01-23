const express = require('express');
const router = express.Router();
const hometaskController = require('../controllers/hometaskController');

router.post('/', hometaskController.createHometask);
router.get('/', hometaskController.getHometasks);
router.get('/:id', hometaskController.getHometaskById);
router.put('/:id', hometaskController.updateHometask);
router.delete('/:id', hometaskController.deleteHometask);

module.exports = router;