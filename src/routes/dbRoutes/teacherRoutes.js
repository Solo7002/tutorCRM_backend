const express = require('express');
const router = express.Router();
const teacherController = require('../../controllers/dbControllers/teacherController');

router.post('/', teacherController.createTeacher);
router.get('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacherById);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
