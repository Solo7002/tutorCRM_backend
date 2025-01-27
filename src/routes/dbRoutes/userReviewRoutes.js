const express = require('express');
const router = express.Router();
const userReviewController = require('../../controllers/dbControllers/userReviewController');

router.post('/', userReviewController.createUserReview);
router.get('/', userReviewController.getUserReviews);
router.get('/search', userReviewController.searchUserReviews);
router.get('/:id', userReviewController.getUserReviewById);
router.put('/:id', userReviewController.updateUserReview);
router.delete('/:id', userReviewController.deleteUserReview);

module.exports = router;