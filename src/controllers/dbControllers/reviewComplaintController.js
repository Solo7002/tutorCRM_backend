const { ReviewComplaint } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createReviewComplaint = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.create(req.body);
    res.status(201).json(reviewComplaint);
  } catch (error) {
    console.error('Error in createReviewComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewComplaints = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const reviewComplaints = await ReviewComplaint.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(reviewComplaints);
  } catch (error) {
    console.error('Error in getReviewComplaints:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewComplaintById = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.findByPk(req.params.id);
    if (!reviewComplaint) return res.status(404).json({ error: "ReviewComplaint not found" });
    res.status(200).json(reviewComplaint);
  } catch (error) {
    console.error('Error in getReviewComplaintById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchReviewComplaints = async (req, res) => {
  try {
    const { startDate, endDate, complaintDescription, userFromId, reviewId } = req.query;
    const whereConditions = {};

    if (startDate && endDate) {
      whereConditions.ComplaintDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.ComplaintDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.ComplaintDate = { [Op.lte]: new Date(endDate) };
    }

    if (complaintDescription) {
      whereConditions.ComplaintDescription = { [Op.like]: `%${complaintDescription}%` };
    }
    if (userFromId) whereConditions.UserFromId = userFromId;
    if (reviewId) whereConditions.ReviewId = reviewId;

    const reviewComplaints = await ReviewComplaint.findAll({
      where: whereConditions,
    });

    if (!reviewComplaints.length) {
      return res.status(404).json({ success: false, message: 'No review complaints found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: reviewComplaints });
  } catch (error) {
    console.error('Error in searchReviewComplaints:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateReviewComplaint = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.findByPk(req.params.id);
    if (!reviewComplaint) return res.status(404).json({ error: "ReviewComplaint not found" });

    await reviewComplaint.update(req.body);
    res.status(200).json(reviewComplaint);
  } catch (error) {
    console.error('Error in updateReviewComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReviewComplaint = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.findByPk(req.params.id);
    if (!reviewComplaint) return res.status(404).json({ error: "ReviewComplaint not found" });

    await reviewComplaint.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteReviewComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};