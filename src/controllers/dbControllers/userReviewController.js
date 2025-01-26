const { UserReview } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.create(req.body);
    res.status(201).json(userReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const userReviews = await UserReview.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(userReviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviewById = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });
    res.status(200).json(userReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });
    
    await userReview.update(req.body);
    res.status(200).json(userReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });
    
    await userReview.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};