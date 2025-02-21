const { HomeTask, Group, GroupStudent, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createHomeTask = async (req, res) => {
  try {
    const homeTask = await HomeTask.create(req.body);
    res.status(201).json(homeTask);
  } catch (error) {
    console.error('Error in createHomeTask:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const homeTasks = await HomeTask.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(homeTasks);
  } catch (error) {
    console.error('Error in getHomeTasks:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTaskById = async (req, res) => {
  try {
    const homeTask = await HomeTask.findByPk(req.params.id);
    if (!homeTask) return res.status(404).json({ error: "HomeTask not found" });
    res.status(200).json(homeTask);
  } catch (error) {
    console.error('Error in getHomeTaskById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchHomeTasks = async (req, res) => {
  try {
    const { homeTaskHeader, groupId, startDate, deadlineDate } = req.query;
    const whereConditions = {};

    if (homeTaskHeader) whereConditions.HomeTaskHeader = { [Op.like]: `%${homeTaskHeader}%` };
    if (groupId) whereConditions.GroupId = groupId;

    if (startDate && deadlineDate) {
      whereConditions.StartDate = { [Op.between]: [new Date(startDate), new Date(deadlineDate)] };
    } else if (startDate) {
      whereConditions.StartDate = { [Op.gte]: new Date(startDate) };
    } else if (deadlineDate) {
      whereConditions.DeadlineDate = { [Op.lte]: new Date(deadlineDate) };
    }

    const homeTasks = await HomeTask.findAll({
      where: whereConditions,
      include: {
        model: Group,
        as: 'Group',
        attributes: ['GroupId', 'GroupName'],
      },
    });

    if (!homeTasks.length) {
      return res.status(404).json({ success: false, message: 'No home tasks found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: homeTasks });
  } catch (error) {
    console.error('Error in searchHomeTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateHomeTask = async (req, res) => {
  try {
    const homeTask = await HomeTask.findByPk(req.params.id);
    if (!homeTask) return res.status(404).json({ error: "HomeTask not found" });

    await homeTask.update(req.body);
    res.status(200).json(homeTask);
  } catch (error) {
    console.error('Error in updateHomeTask:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHomeTask = async (req, res) => {
  try {
    const homeTask = await HomeTask.findByPk(req.params.id);
    if (!homeTask) return res.status(404).json({ error: "HomeTask not found" });

    await homeTask.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteHomeTask:', error);
    res.status(400).json({ error: error.message });
  }
};


exports.getNewHomeTasksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

  
    const studentGroups = await GroupStudent.findAll({
      attributes: ['GroupId'],
      where: { StudentId: studentId },
    });

    
    if (!studentGroups.length) {
      return res.status(200).json({
        message: `No home tasks for student ID: ${studentId}`,
        data: [],
      });
    }

    
    const groupIds = studentGroups.map((group) => group.GroupId);

   
    const homeTasks = await HomeTask.findAll({
      where: {
        GroupId: { [Op.in]: groupIds }, 
      },
      include: [
        {
          model: Group,
          as: 'Group',
          attributes: ['GroupId', 'GroupName'],
        },
      ],
    });

    res.status(200).json({
      message: `Home tasks for student ID: ${studentId}`,
      data: homeTasks,
    });
  } catch (error) {
    console.error('Error in getNewHomeTasksByStudentId:', error);
    res.status(500).json({
      message: `Error in getNewHomeTasksByStudentId: ${error.message}`,
    });
  }
};

