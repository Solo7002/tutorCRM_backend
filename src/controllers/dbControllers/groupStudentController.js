const { GroupStudent } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

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
    const { where, order } = parseQueryParams(req.query);
    const groupStudents = await GroupStudent.findAll({ attributes: ['GroupId', 'StudentId'], where: where || undefined, order: order || undefined });
    res.status(200).json(groupStudents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getGroupStudentById = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id, {
      attributes: ['GroupId', 'StudentId']
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