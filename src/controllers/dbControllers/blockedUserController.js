const { BlockedUser, User } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createBlockedUser = async (req, res) => {
  try {
    const { UserId } = req.body;
    const user = await User.findByPk(UserId);
    if (!user) {
      return res.status(400).json({ error: 'User with the specified UserId does not exist' });
    }
    const blockedUser = await BlockedUser.create(req.body);
    res.status(201).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);

    const blockedUsers = await BlockedUser.findAll({
      where: where || undefined, 
      order: order || undefined,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username','Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });

    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlockedUserById = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username', 'Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });

    if (!blockedUser) {
      return res.status(404).json({ error: 'BlockedUser not found' });
    }

    res.status(200).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchBlockedUsers = async (req, res) => {
  try {
    const { reasonDescription, startDate, endDate, userId } = req.query;
    let whereConditions = {};

    if (reasonDescription) {
      whereConditions.ReasonDescription = { [Op.like]: `%${reasonDescription}%` };
    }
    if (startDate) {
      whereConditions.BanStartDate = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      whereConditions.BanEndDate = { [Op.lte]: new Date(endDate) };
    }
    if (userId) {
      whereConditions.UserId = userId; 
    }

    const blockedUsers = await BlockedUser.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username', 'Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });

    if (!blockedUsers.length) {
      return res.status(404).json({ success: false, message: 'No blocked users found matching the criteria.' });
    }

    res.status(200).json({ success: true, data: blockedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateBlockedUser = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id);

    if (!blockedUser) {
      return res.status(404).json({ error: 'BlockedUser not found' });
    }

    const { UserId } = req.body;

    if (UserId && UserId !== blockedUser.UserId) {
      const user = await User.findByPk(UserId);
      if (!user) {
        return res.status(400).json({ error: 'User with the specified UserId does not exist' });
      }
    }

    await blockedUser.update(req.body);
    res.status(200).json(blockedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlockedUser = async (req, res) => {
  try {
    const blockedUser = await BlockedUser.findByPk(req.params.id);

    if (!blockedUser) {
      return res.status(404).json({ error: 'BlockedUser not found' });
    }

    await blockedUser.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};