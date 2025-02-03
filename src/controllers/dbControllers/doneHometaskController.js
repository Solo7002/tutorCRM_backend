const { DoneHomeTask, HomeTask, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.create(req.body);
    res.status(201).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneHometasks = await DoneHomeTask.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(doneHometasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskById = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchDoneHomeTasks = async (req, res) => {
  try {
    const { mark, studentId, homeTaskId, doneDate } = req.query;
    let whereConditions = {};

    if (mark) whereConditions.Mark = { [Op.eq]: mark };
    if (studentId) whereConditions.StudentId = studentId;
    if (homeTaskId) whereConditions.HomeTaskId = homeTaskId;
    if (doneDate) whereConditions.DoneDate = { [Op.eq]: doneDate };

    const tasks = await DoneHomeTask.findAll({
      where: whereConditions,
      include: [
        { model: HomeTask, as: 'HomeTask', attributes: ['HomeTaskId', 'TaskName'] },
        { model: Student, as: 'Student', attributes: ['StudentId', 'FullName'] },
      ],
    });

    if (!tasks.length) {
      return res.status(404).json({ success: false, message: 'No tasks found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error in searchDoneHomeTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });

    await doneHometask.update(req.body);
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });

    await doneHometask.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};