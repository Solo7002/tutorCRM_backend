const express = require('express');
const router = express.Router();
const materialVisibilityStudentController = require('../../controllers/dbControllers/materialVisibilityStudentController');

router.post('/', materialVisibilityStudentController.createMaterialVisibilityStudent);
router.get('/', materialVisibilityStudentController.getMaterialVisibilityStudents);
router.get('/search', materialVisibilityStudentController.searchMaterialVisibility);
router.get('/:id', materialVisibilityStudentController.getMaterialVisibilityStudentById);
router.put('/:id', materialVisibilityStudentController.updateMaterialVisibilityStudent);
router.delete('/:id', materialVisibilityStudentController.deleteMaterialVisibilityStudent);

module.exports = router;