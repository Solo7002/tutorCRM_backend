const { UserPhone } = require('../models/userPhone');

exports.createUserPhone = async (req, res) => {
  try {
    const userPhone = await UserPhone.create(req.body);
    res.status(201).json(userPhone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPhones = async (req, res) => {
  try {
    const userPhones = await UserPhone.findAll();
    res.status(200).json(userPhones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPhoneById = async (req, res) => {
  try {
    const userPhone = await UserPhone.findByPk(req.params.id);
    if (!userPhone) return res.status(404).json({ error: "UserPhone not found" });
    res.status(200).json(userPhone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserPhone = async (req, res) => {
  try {
    const userPhone = await UserPhone.findByPk(req.params.id);
    if (!userPhone) return res.status(404).json({ error: "UserPhone not found" });
    
    await userPhone.update(req.body);
    res.status(200).json(userPhone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUserPhone = async (req, res) => {
  try {
    const userPhone = await UserPhone.findByPk(req.params.id);
    if (!userPhone) return res.status(404).json({ error: "UserPhone not found" });
    
    await userPhone.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};