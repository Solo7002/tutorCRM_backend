const { Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const students = await Student.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { schoolName, grade } = req.query;
    let whereConditions = {};

    if (schoolName) whereConditions.SchoolName = { [Op.like]: `%${schoolName}%` };
    if (grade) whereConditions.Grade = { [Op.like]: `%${grade}%` };

    const students = await Student.findAll({
      where: whereConditions,
    });

    if (!students.length) return res.status(404).json({ success: false, message: 'No students found.' });

    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.status(200).json(student);
  } catch (error) {
    console.error('Error in updateStudent:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    return res.status(400).json({ error: error.message });
  }
};