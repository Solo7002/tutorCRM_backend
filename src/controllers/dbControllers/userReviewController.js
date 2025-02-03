const { UserReview } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.create(req.body);
    res.status(201).json(userReview);
  } catch (error) {
    console.error('Error in createUserReview:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const userReviews = await UserReview.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(userReviews);
  } catch (error) {
    console.error('Error in getUserReviews:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReviewById = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });
    res.status(200).json(userReview);
  } catch (error) {
    console.error('Error in getUserReviewById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchUserReviews = async (req, res) => {
  try {
    const { reviewHeader, reviewText, startDate, endDate } = req.query;
    const whereConditions = {};

    if (reviewHeader) whereConditions.ReviewHeader = { [Op.like]: `%${reviewHeader}%` };
    if (reviewText) whereConditions.ReviewText = { [Op.like]: `%${reviewText}%` };

    if (startDate && endDate) {
      whereConditions.CreateDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.CreateDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.CreateDate = { [Op.lte]: new Date(endDate) };
    }

    const userReviews = await UserReview.findAll({
      where: whereConditions,
      attributes: ['UserReviewId', 'ReviewHeader', 'ReviewText', 'CreateDate'],
    });

    if (!userReviews.length) {
      return res.status(404).json({ success: false, message: 'No user reviews found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: userReviews });
  } catch (error) {
    console.error('Error in searchUserReviews:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) return res.status(404).json({ error: "UserReview not found" });

    await userReview.update(req.body);
    res.status(200).json(userReview);
  } catch (error) {
    console.error('Error in updateUserReview:', error);
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
    console.error('Error in deleteUserReview:', error);
    res.status(400).json({ error: error.message });
  }
};