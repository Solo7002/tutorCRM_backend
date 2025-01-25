const express = require('express');
const router = express.Router();
const materialController = require('../../controllers/dbControllers/materialController');

router.post('/', materialController.createMaterial);
router.get('/', materialController.getMaterials);
router.get('/:id', materialController.getMaterialById);
router.put('/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;