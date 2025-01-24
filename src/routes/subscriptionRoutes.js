const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/', subscriptionController.createSubscription);
router.get('/', subscriptionController.getSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
