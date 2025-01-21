const express = require('express');
const router = express.Router();
const groupStudentController = require('../controllers/groupStudentController');

router.post('/', groupStudentController.createGroupStudent);
router.get('/', groupStudentController.getAllGroupStudents);
router.get('/:id', groupStudentController.getGroupStudentById);
router.put('/:id', groupStudentController.updateGroupStudent);
router.delete('/:id', groupStudentController.deleteGroupStudent);

module.exports = router;