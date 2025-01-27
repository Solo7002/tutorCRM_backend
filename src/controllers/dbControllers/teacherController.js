const { Teacher } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const teachers = await Teacher.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchTeachers = async (req, res) => {
  try {
    const { lessonType, meetingType, aboutTeacher } = req.query;
    let whereConditions = {};

    if (lessonType) whereConditions.LessonType = lessonType;
    if (meetingType) whereConditions.MeetingType = meetingType;
    if (aboutTeacher) whereConditions.AboutTeacher = { [Op.like]: `%${aboutTeacher}%` };

    const teachers = await Teacher.findAll({
      where: whereConditions,
    });

    if (!teachers.length) return res.status(404).json({ success: false, message: 'No teachers found.' });

    return res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.update(req.body);
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.destroy();
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};