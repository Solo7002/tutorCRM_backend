const express = require('express');
const router = express.Router();
const userComplaintController = require('../../controllers/dbControllers/userComplaintController');

router.post('/', userComplaintController.createUserComplaint);
router.get('/', userComplaintController.getUserComplaints);
router.get('/search', userComplaintController.searchUserComplaints);
router.get('/:id', userComplaintController.getUserComplaintById);
router.put('/:id', userComplaintController.updateUserComplaint);
router.delete('/:id', userComplaintController.deleteUserComplaint);

module.exports = router