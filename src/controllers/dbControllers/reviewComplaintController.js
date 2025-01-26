const { ReviewComplaint } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

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