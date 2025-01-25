const express = require('express');
const router = express.Router();
const saleMaterialFileController = require('../../controllers/dbControllers/saleMaterialFileController');

router.post('/', saleMaterialFileController.createSaleMaterialFile);
router.get('/', saleMaterialFileController.getSaleMaterialFiles);
router.get('/:id', saleMaterialFileController.getSaleMaterialFileById);
router.put('/:id', saleMaterialFileController.updateSaleMaterialFile);
router.delete('/:id', saleMaterialFileController.deleteSaleMaterialFile);

module.exports = router;