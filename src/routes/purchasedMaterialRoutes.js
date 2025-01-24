const express = require('express');
const router = express.Router();
const purchasedMaterialController = require('../controllers/purchasedMaterialController');

router.post('/', purchasedMaterialController.createPurchasedMaterial);
router.get('/', purchasedMaterialController.getPurchasedMaterials);
router.get('/:id', purchasedMaterialController.getPurchasedMaterialById);
router.put('/:id', purchasedMaterialController.updatePurchasedMaterial);
router.delete('/:id', purchasedMaterialController.deletePurchasedMaterial);

module.exports = router;