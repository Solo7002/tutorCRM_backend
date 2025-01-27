const { PlannedLesson } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createPlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.create(req.body);
    res.status(201).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessons = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const PlannedLessons = await PlannedLesson.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(PlannedLessons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessonById = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    res.status(200).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchPlannedLessons = async (req, res) => {
  try {
    const { lessonHeader, lessonPrice, isPaid, groupId } = req.query;
    let whereConditions = {};

    if (lessonHeader) whereConditions.LessonHeader = { [Op.like]: `%${lessonHeader}%` };
    if (lessonPrice) whereConditions.LessonPrice = lessonPrice;
    if (isPaid !== undefined) whereConditions.IsPaid = isPaid;
    if (groupId) whereConditions.GroupId = groupId;

    const plannedLessons = await PlannedLesson.findAll({
      where: whereConditions,
    });

    if (!plannedLessons.length) return res.status(404).json({ success: false, message: 'No planned lessons found matching the criteria.' });

    return res.status(200).json({ success: true, data: plannedLessons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updatePlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    
    await PlannedLesson.update(req.body);
    res.status(200).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    
    await PlannedLesson.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};