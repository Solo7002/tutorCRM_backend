const express = require('express');
const router = express.Router();
const userReviewController = require('../controllers/userReviewController');

router.post('/', userReviewController.createUserReview);
router.get('/', userReviewController.getAllUserReviews);
router.get('/:id', userReviewController.getUserReviewById);
router.put('/:id', userReviewController.updateUserReview);
router.delete('/:id', userReviewController.deleteUserReview);

module.exports = router;