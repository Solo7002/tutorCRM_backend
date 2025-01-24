const { Subscription } = require('../models');

exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    return res.status(201).json(subscription);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    return res.status(200).json(subscriptions);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    await subscription.update(req.body);
    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByPk(req.params.id);
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    await subscription.destroy();
    return res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};