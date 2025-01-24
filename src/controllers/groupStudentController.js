const { GroupStudent } = require('../models');

exports.createGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.create(req.body);
    res.status(201).json(groupStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupStudents = async (req, res) => {
  try {
    const groupStudents = await GroupStudent.findAll({
      attributes: ['groupId', 'studentId']
    });
    res.status(200).json(groupStudents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getGroupStudentById = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id, {
      attributes: ['groupId', 'studentId']
    });
    
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });
    res.status(200).json(groupStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });
    
    await groupStudent.update(req.body);
    res.status(200).json(groupStudent);
  } catch (error) {
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
    res.status(400).json({ error: error.message });
  }
};