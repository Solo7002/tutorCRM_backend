const express = require('express');
const router = express.Router();
const purchasedMaterialController = require('../../controllers/dbControllers/purchasedMaterialController');

router.post('/', purchasedMaterialController.createPurchasedMaterial);
router.get('/', purchasedMaterialController.getPurchasedMaterials);
router.get('/search', purchasedMaterialController.searchPurchasedMaterials);
router.get('/:id', purchasedMaterialController.getPurchasedMaterialById);
router.put('/:id', purchasedMaterialController.updatePurchasedMaterial);
router.delete('/:id', purchasedMaterialController.deletePurchasedMaterial);

module.exports = router;