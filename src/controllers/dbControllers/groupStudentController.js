const { GroupStudent, Group, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.create(req.body);
    res.status(201).json(groupStudent);
  } catch (error) {
    console.error('Error in createGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const groupStudents = await GroupStudent.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(groupStudents);
  } catch (error) {
    console.error('Error in getGroupStudents:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupStudentById = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });
    res.status(200).json(groupStudent);
  } catch (error) {
    console.error('Error in getGroupStudentById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchGroupStudents = async (req, res) => {
  try {
    const { groupId, studentId } = req.query;
    const whereConditions = {};

    if (groupId) whereConditions.GroupId = groupId;
    if (studentId) whereConditions.StudentId = studentId;

    const groupStudents = await GroupStudent.findAll({
      where: whereConditions,
      include: [
        {
          model: Group,
          as: 'Group',
          attributes: ['GroupId', 'GroupName'],
        },
        {
          model: Student,
          as: 'Student',
          attributes: ['StudentId', 'FirstName', 'LastName'],
        },
      ],
    });

    if (!groupStudents.length) {
      return res.status(404).json({ success: false, message: 'No group students found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: groupStudents });
  } catch (error) {
    console.error('Error in searchGroupStudents:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });

    await groupStudent.update(req.body);
    res.status(200).json(groupStudent);
  } catch (error) {
    console.error('Error in updateGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });

    await groupStudent.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};