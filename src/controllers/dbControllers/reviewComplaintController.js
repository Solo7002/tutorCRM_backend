const { ReviewComplaint } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createReviewComplaint = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.create(req.body);
    res.status(201).json(reviewComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewComplaints = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const reviewComplaints = await ReviewComplaint.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(reviewComplaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewComplaintById = async (req, res) => {
  try {
    const reviewComplaint = await ReviewComplaint.findByPk(req.params.id);
    if (!reviewComplaint) return res.status(404).json({ error: "ReviewComplaint not found" });
    res.status(200).json(reviewComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchReviewComplaints = async (req, res) => {
  try {
    const { complaintDate, complaintDescription, userFromId, reviewId } = req.query;
    let whereConditions = {};

    if (complaintDate) whereConditions.ComplaintDate = { [Op.gte]: new Date(complaintDate) };
    if (complaintDescription) whereConditions.ComplaintDescription = { [Op.like]: `%${complaintDescription}%` };
    if (userFromId) whereConditions.UserFromId = userFromId;
    if (reviewId) whereConditions.ReviewId = reviewId;

    const reviewComplaints = await ReviewComplaint.findAll({
      where: whereConditions,
    });

    if (!reviewComplaints.length) return res.status(404).json({ success: false, message: 'No review complaints found matching the criteria.' });

    return res.status(200).json({ success: true, data: reviewComplaints });
  } catch (error) {
    console.error(error);
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
    res.status(400).json({ error: error.message });
  }
};