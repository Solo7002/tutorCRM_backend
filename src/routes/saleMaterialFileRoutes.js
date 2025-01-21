const express = require('express');
const router = express.Router();
const saleMaterialFileController = require('../controllers/saleMaterialFileController');

router.post('/', saleMaterialFileController.createSaleMaterialFile);
router.get('/', saleMaterialFileController.getAllSaleMaterialFiles);
router.get('/:id', saleMaterialFileController.getSaleMaterialFileById);
router.put('/:id', saleMaterialFileController.updateSaleMaterialFile);
router.delete('/:id', saleMaterialFileController.deleteSaleMaterialFile);

module.exports = router;