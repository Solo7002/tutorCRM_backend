const express = require('express');
const router = express.Router();
const reviewComplaintController = require('../controllers/reviewComplaintController');

router.post('/', reviewComplaintController.createReviewComplaint);
router.get('/', reviewComplaintController.getReviewComplaints);
router.get('/:id', reviewComplaintController.getReviewComplaintById);
router.put('/:id', reviewComplaintController.updateReviewComplaint);
router.delete('/:id', reviewComplaintController.deleteReviewComplaint);

module.exports = router;