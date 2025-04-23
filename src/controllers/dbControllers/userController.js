const { model } = require('../../config/database');
const { User, Student, Teacher, Trophies, OctoCoins, UserPhone, sequelize } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { setCache, getCache, deleteCache } = require('../../utils/cacheUtils'); 
const emailService = require('../../services/emailService');
const logger = require('../../utils/logger');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

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

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByPk(userId, {
            attributes: ['UserId', 'Username', 'FirstName', 'LastName', 'ImageFilePath', 'CreateDate'],
            include: [
                { model: Student, as: 'Student', include: [{ model: Trophies, as: 'Trophies' }] },
                { model: Teacher, as: 'Teacher', include: [{ model: OctoCoins, as: 'OctoCoins' }] },{
                model: UserPhone,
                as: 'UserPhones',
                attributes: ['PhoneNumber', 'NickName', 'SocialNetworkName'],
                required: false
            }],
        });
        const role = user.Teacher ? 'Teacher' : 'Student';

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = {
            UserId: user.UserId,
            Username: user.Username,
            FirstName: user.FirstName,
            LastName: user.LastName,
            ImageFilePath: user.ImageFilePath,
            CreateDate: user.CreateDate,
            PhoneNumber: user.UserPhones && user.UserPhones.length > 0 ? user.UserPhones[0].PhoneNumber : null,
            Role: role
        };

        res.json(profile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserCredentials = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByPk(userId, {
            attributes: ['UserId', 'Email'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const credentials = {
            UserId: user.UserId,
            Email: user.Email
        };

        res.json(credentials);
    } catch (error) {
        console.error('Error fetching user credentials:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { user: userData, phone: phoneData } = req.body;
        const userId = req.params.id;

        const result = await sequelize.transaction(async (t) => {
            if (userData) {
                await User.update(userData, {
                    where: { UserId: userId },
                    transaction: t
                });
            }

            if (phoneData) {
                const [userPhone] = await UserPhone.findOrCreate({
                    where: { UserId: userId },
                    defaults: {
                        ...phoneData,
                        UserId: userId
                    },
                    transaction: t
                });

                if (userPhone) {
                    await userPhone.update(phoneData, { transaction: t });
                }
            }

            const updatedUser = await User.findByPk(userId, {
                attributes: ['UserId', 'Username', 'FirstName', 'LastName', 'ImageFilePath', 'CreateDate'],
                include: [{
                    model: UserPhone,
                    as: 'UserPhones',
                    attributes: ['PhoneNumber', 'NickName', 'SocialNetworkName']
                }],
                transaction: t
            });

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return res.status(400).json({ error: error.message });
    }
};

exports.sendUpdateCredentialsCode = async (req, res) => {
    try {
      const { UserId, NewEmail, NewPassword } = req.body;
  
      if (!UserId || (!NewEmail && !NewPassword)) {
        return res.status(400).json({ message: 'UserId and at least one of NewEmail or NewPassword are required' });
      }
  
      // Проверяем, существует ли пользователь
      const user = await User.findByPk(UserId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Проверяем, не занят ли новый email (если указан)
      if (NewEmail && NewEmail !== user.Email) {
        const existingUser = await User.findOne({ where: { Email: NewEmail } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
      }
  
      // Генерируем 6-значный код подтверждения
      const verificationCode = crypto.randomInt(100000, 999999).toString();
  
      // Сохраняем код и данные в Redis (на 10 минут)
      const redisKey = `update_credentials_${UserId}`;
      await setCache(redisKey, {
        code: verificationCode,
        NewEmail: NewEmail || null,
        NewPassword: NewPassword || null,
      }, 600);
  
      // Отправляем код на новый email (если указан) или на текущий
      const emailToSend = NewEmail || user.Email;
      const username = user.Username || `${user.LastName} ${user.FirstName}`;
      await emailService.sendVerificationCode(emailToSend, username, verificationCode);
  
      logger.info(`Verification code sent to: ${emailToSend} for user: ${UserId}`);
      res.status(200).json({ message: 'Verification code has been sent to your email.' });
    } catch (error) {
      logger.error(`Send update credentials code error: ${error.message}, Stack: ${error.stack}`);
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.confirmUpdateCredentials = async (req, res) => {
    try {
      const { UserId, Code } = req.body;
  
      // Проверяем наличие UserId и Code
      if (!UserId || !Code) {
        logger.error(`Missing UserId or Code: UserId=${UserId}, Code=${Code}`);
        return res.status(400).json({ message: 'UserId and Code are required' });
      }
  
      // Приводим UserId к числу для надёжности
      const userIdNumber = parseInt(UserId, 10);
      if (isNaN(userIdNumber)) {
        logger.error(`Invalid UserId format: ${UserId}`);
        return res.status(400).json({ message: 'Invalid UserId format' });
      }
  
      // Проверяем, существует ли пользователь
      const user = await User.findByPk(userIdNumber);
      if (!user) {
        logger.error(`User not found for UserId: ${userIdNumber}`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Получаем данные из Redis
      const redisKey = `update_credentials_${userIdNumber}`;
      const cachedData = await getCache(redisKey);
  
      if (!cachedData) {
        logger.error(`No cached data found for key: ${redisKey}`);
        return res.status(400).json({ message: 'Verification code has expired or does not exist' });
      }
  
      const { code, NewEmail, NewPassword } = cachedData;
  
      // Проверяем, что code определён
      if (!code) {
        logger.error(`No verification code found in Redis for key: ${redisKey}`);
        return res.status(400).json({ message: 'Invalid or missing verification code in cache' });
      }
  
      // Сравниваем коды (приводим Code к строке для надёжности)
      if (Code.toString() !== code) {
        logger.error(`Invalid code provided for UserId: ${userIdNumber}. Expected: ${code}, Received: ${Code}`);
        return res.status(400).json({ message: 'Invalid verification code' });
      }
  
      // Формируем данные для обновления
      const updateData = {};
      if (NewEmail && NewEmail !== user.Email) {
        updateData.Email = NewEmail;
      }
      if (NewPassword) {
        updateData.Password = await hashPassword(NewPassword);
      }
  
      // Обновляем пользователя, если есть данные для обновления
      if (Object.keys(updateData).length > 0) {
        logger.info(`Updating user data for UserId: ${userIdNumber}, updateData: ${JSON.stringify(updateData)}`);
        await User.update(updateData, { where: { UserId: userIdNumber } });
      } else {
        logger.info(`No changes to apply for UserId: ${userIdNumber}`);
      }
  
      // Удаляем код из Redis
      try {
        await deleteCache(redisKey);
        logger.info(`Deleted Redis key: ${redisKey}`);
      } catch (cacheError) {
        logger.error(`Failed to delete Redis key ${redisKey}: ${cacheError.message}`);
      }
  
      logger.info(`Credentials updated for user: ${userIdNumber}`);
      res.status(200).json({ message: 'Credentials updated successfully' });
    } catch (error) {
      logger.error(`Confirm update credentials error: ${error.message}, Stack: ${error.stack}`);
      res.status(400).json({ message: error.message });
    }
  };