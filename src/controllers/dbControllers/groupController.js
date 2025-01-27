const { Group, GroupStudent } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const groups = await Group.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchGroups = async (req, res) => {
  try {
    const { groupName, minPrice, maxPrice } = req.query;
    let whereConditions = {};

    if (groupName) whereConditions.GroupName = { [Op.like]: `%${groupName}%` };
    if (minPrice) whereConditions.GroupPrice = { [Op.gte]: minPrice };
    if (maxPrice) whereConditions.GroupPrice = { [Op.lte]: maxPrice };

    const groups = await Group.findAll({
      where: whereConditions,
      include: {
        model: GroupStudent,
        as: 'Students',
        attributes: ['GroupId', 'StudentId'],
      }
    });

    if (!groups.length) return res.status(404).json({ success: false, message: 'No groups found matching the criteria.' });

    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    
    await group.update(req.body);
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    
    await group.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};