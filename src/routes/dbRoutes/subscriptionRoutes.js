const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/dbControllers/subscriptionController');

router.post('/', subscriptionController.createSubscription);
router.get('/', subscriptionController.getSubscriptions);
router.get('/search', subscriptionController.searchSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
