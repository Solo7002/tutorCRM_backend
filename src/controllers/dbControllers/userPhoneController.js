const { UserPhone } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

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
    const { where, order } = parseQueryParams(req.query);
    const userPhones = await UserPhone.findAll({ where: where || undefined, order: order || undefined });
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

exports.searchUserPhones = async (req, res) => {
  try {
    const { phoneNumber, nickname, socialNetworkName } = req.query;
    let whereConditions = {};

    if (phoneNumber) whereConditions.PhoneNumber = { [Op.like]: `%${phoneNumber}%` };
    if (nickname) whereConditions.NickName = { [Op.like]: `%${nickname}%` };
    if (socialNetworkName) whereConditions.SocialNetworkName = { [Op.like]: `%${socialNetworkName}%` };

    const userPhones = await UserPhone.findAll({
      where: whereConditions,
      attributes: ['UserPhoneId', 'PhoneNumber', 'NickName', 'SocialNetworkName'],
    });

    if (!userPhones.length) {
      return res.status(404).json({ success: false, message: 'No user phones found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: userPhones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
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