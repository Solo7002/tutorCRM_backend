const { model } = require('../../config/database');
const { User, Student, Teacher, Trophies, OctoCoins } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
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

exports.getUserIsTeacherById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'Student'
        },
        {
          model: Teacher,
          as: 'Teacher'
        }
      ]
    });


    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      isTeacher: user.Teacher?true:false
     });
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

exports.getUserBalance = async (req, res) => {
  try {
    const userId = req.params.id;

    // Находим пользователя
    const user = await User.findByPk(userId, {
      include: [
        { model: Student, as: 'Student', include: [{ model: Trophies, as: 'Trophies' }] },
        { model: Teacher, as: 'Teacher', include: [{ model: OctoCoins, as: 'OctoCoins' }] },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Проверяем роль пользователя и возвращаем соответствующий баланс
    if (user.Student) {
      // Ученик: возвращаем трофеи
      const trophies = user.Student.Trophies ? user.Student.Trophies.Amount : 0;
      return res.status(200).json({
        UserId: user.UserId,
        LastName: user.LastName,
        FirstName: user.FirstName,
        Username: user.Username,
        Role: 'Student',
        Balance: {
          Trophies: trophies,
        },
      });
    } else if (user.Teacher) {
      // Учитель: возвращаем монетки
      const coins = user.Teacher.OctoCoins ? user.Teacher.OctoCoins.Amount : 0;
      return res.status(200).json({
        UserId: user.UserId,
        LastName: user.LastName,
        FirstName: user.FirstName,
        Username: user.Username,
        Role: 'Teacher',
        Balance: {
          OctoCoins: coins,
        },
      });
    } else {
      // Если пользователь не учитель и не ученик
      return res.status(400).json({ message: 'User role not defined (neither Student nor Teacher)' });
    }
  } catch (error) {
    console.error('Error in getUserBalance:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};