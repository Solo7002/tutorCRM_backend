const { UserComplaint } = require('../../models/dbModels');

exports.createUserComplaint = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.create(req.body);
    res.status(201).json(userComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const userComplaints = await UserComplaint.findAll();
    res.status(200).json(userComplaints);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserComplaintById = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.findByPk(req.params.id);
    if (!userComplaint) return res.status(404).json({ error: "UserComplaint not found" });
    res.status(200).json(userComplaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserComplaint = async (req, res) => {
  try {
    const userComplaint = await UserComplaint.findByPk(req.params.id);
    if (!userComplaint) return res.status(404).json({ error: "UserComplaint not found" });
    
    await userComplaint.update(req.body);
    res.status(200).json(userComplaint);
  } catch (error) {
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
    res.status(400).json({ error: error.message });
  }
};