const { Subscription } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

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
    const { where, order } = parseQueryParams(req.query);
    const subscriptions = await Subscription.findAll({ where: where || undefined, order: order || undefined });
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

exports.searchSubscriptions = async (req, res) => {
  try {
    const { subscriptionName, subscriptionPrice } = req.query;
    let whereConditions = {};

    if (subscriptionName) whereConditions.SubscriptionName = { [Op.like]: `%${subscriptionName}%` };
    if (subscriptionPrice) whereConditions.SubscriptionPrice = subscriptionPrice;

    const subscriptions = await Subscription.findAll({
      where: whereConditions,
    });

    if (!subscriptions.length) return res.status(404).json({ success: false, message: 'No subscriptions found.' });

    return res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
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