const express = require('express');
const router = express.Router();
const saleMaterialController = require('../controllers/saleMaterialController');

router.post('/', saleMaterialController.createSaleMaterial);
router.get('/', saleMaterialController.getAllSaleMaterials);
router.get('/:id', saleMaterialController.getSaleMaterialById);
router.put('/:id', saleMaterialController.updateSaleMaterial);
router.delete('/:id', saleMaterialController.deleteSaleMaterial);

module.exports = router;