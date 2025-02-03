const { HomeTask, Group } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.create(req.body);
    res.status(201).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const HomeTasks = await HomeTask.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(HomeTasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTaskById = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    res.status(200).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchHomeTasks = async (req, res) => {
  try {
    const { homeTaskHeader, groupId, startDate, deadlineDate } = req.query;
    let whereConditions = {};

    if (homeTaskHeader) whereConditions.HomeTaskHeader = { [Op.like]: `%${homeTaskHeader}%` };
    if (groupId) whereConditions.GroupId = groupId;
    if (startDate) whereConditions.StartDate = { [Op.gte]: new Date(startDate) };
    if (deadlineDate) whereConditions.DeadlineDate = { [Op.lte]: new Date(deadlineDate) };

    const homeTasks = await HomeTask.findAll({
      where: whereConditions,
      include: {
        model: Group,
        as: 'Group',
        attributes: ['GroupId', 'GroupName'],
      }
    });

    if (!homeTasks.length) return res.status(404).json({ success: false, message: 'No home tasks found matching the criteria.' });

    return res.status(200).json({ success: true, data: homeTasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    
    await HomeTask.update(req.body);
    res.status(200).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    
    await HomeTask.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};