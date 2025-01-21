const express = require('express');
const router = express.Router();
const userComplaintController = require('../controllers/userComplaintController');

router.post('/', userComplaintController.createUserComplaint);
router.get('/', userComplaintController.getAllUserComplaints);
router.get('/:id', userComplaintController.getUserComplaintById);
router.put('/:id', userComplaintController.updateUserComplaint);
router.delete('/:id', userComplaintController.deleteUserComplaint);

module.exports = router