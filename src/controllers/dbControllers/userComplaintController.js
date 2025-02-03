const { UserComplaint } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createUserComplaint = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.create(req.body);
    res.status(201).json(userComplaint);
  } catch (error) {
    console.error('Error in createUserComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const userComplaints = await UserComplaint.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(userComplaints);
  } catch (error) {
    console.error('Error in getUserComplaints:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUserComplaintById = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.findByPk(req.params.id);
    if (!userComplaint) return res.status(404).json({ error: "UserComplaint not found" });
    res.status(200).json(userComplaint);
  } catch (error) {
    console.error('Error in getUserComplaintById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchUserComplaints = async (req, res) => {
  try {
    const { description, startDate, endDate } = req.query;
    const whereConditions = {};

    if (description) whereConditions.ComplaintDescription = { [Op.like]: `%${description}%` };

    if (startDate && endDate) {
      whereConditions.ComplaintDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.ComplaintDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.ComplaintDate = { [Op.lte]: new Date(endDate) };
    }

    const userComplaints = await UserComplaint.findAll({
      where: whereConditions,
      attributes: ['UserComplaintId', 'ComplaintDate', 'ComplaintDescription'],
    });

    if (!userComplaints.length) {
      return res.status(404).json({ success: false, message: 'No user complaints found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: userComplaints });
  } catch (error) {
    console.error('Error in searchUserComplaints:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateUserComplaint = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.findByPk(req.params.id);
    if (!userComplaint) return res.status(404).json({ error: "UserComplaint not found" });

    await userComplaint.update(req.body);
    res.status(200).json(userComplaint);
  } catch (error) {
    console.error('Error in updateUserComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserComplaint = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.findByPk(req.params.id);
    if (!userComplaint) return res.status(404).json({ error: "UserComplaint not found" });

    await userComplaint.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUserComplaint:', error);
    res.status(400).json({ error: error.message });
  }
};