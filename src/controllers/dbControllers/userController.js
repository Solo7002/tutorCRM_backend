const { User } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
  console.log("+++++++++++++++++ Create user");
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const users = await User.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { username, email, firstName, lastName, startDate, endDate } = req.query;
    let whereConditions = {};
    if (username) whereConditions.Username = { [Op.like]: `%${username}%` };
    if (email) whereConditions.Email = { [Op.like]: `%${email}%` };
    if (firstName) whereConditions.FirstName = { [Op.like]: `%${firstName}%` };
    if (lastName) whereConditions.LastName = { [Op.like]: `%${lastName}%` };
    if (startDate && endDate) whereConditions.CreateDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };

    const users = await User.findAll({
      where: whereConditions,
      attributes: ['UserId', 'Username', 'FirstName', 'LastName', 'Email', 'CreateDate'],
    });

    if (!users.length) {
      return res.status(404).json({ success: false, message: 'No users found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error in searchUsers:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};