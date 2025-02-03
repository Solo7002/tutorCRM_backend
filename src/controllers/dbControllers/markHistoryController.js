const { MarkHistory, Student, Course } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.create(req.body);
    res.status(201).json(markHistory);
  } catch (error) {
    console.error('Error in createMarkHistory:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getMarkHistories = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const markHistories = await MarkHistory.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(markHistories);
  } catch (error) {
    console.error('Error in getMarkHistories:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getMarkHistoryById = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });
    res.status(200).json(markHistory);
  } catch (error) {
    console.error('Error in getMarkHistoryById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchMarkHistory = async (req, res) => {
  try {
    const { markType, mark, studentId, courseId, startDate, endDate } = req.query;
    const whereConditions = {};

    if (markType) whereConditions.MarkType = markType;
    if (mark) whereConditions.Mark = parseInt(mark, 10);
    if (studentId) whereConditions.StudentId = studentId;
    if (courseId) whereConditions.CourseId = courseId;

    if (startDate && endDate) {
      whereConditions.MarkDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.MarkDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.MarkDate = { [Op.lte]: new Date(endDate) };
    }

    const markHistories = await MarkHistory.findAll({
      where: whereConditions,
      include: [
        { model: Student, as: 'Student', attributes: ['StudentId', 'FirstName', 'LastName'] },
        { model: Course, as: 'Course', attributes: ['CourseId', 'CourseName'] },
      ],
    });

    if (!markHistories.length) {
      return res.status(404).json({ success: false, message: 'No mark histories found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: markHistories });
  } catch (error) {
    console.error('Error in searchMarkHistory:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });

    await markHistory.update(req.body);
    res.status(200).json(markHistory);
  } catch (error) {
    console.error('Error in updateMarkHistory:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });

    await markHistory.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteMarkHistory:', error);
    res.status(400).json({ error: error.message });
  }
};