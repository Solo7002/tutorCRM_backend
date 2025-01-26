const { MaterialVisibilityStudent } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.create(req.body);
    res.status(201).json(materialVisibilityStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialVisibilityStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const materialVisibilityStudents = await MaterialVisibilityStudent.findAll({ attributes: ['MaterialId', 'StudentId'], where: where || undefined, order: order || undefined });
    res.status(200).json(materialVisibilityStudents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialVisibilityStudentById = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id, {
      attributes: ['MaterialId', 'StudentId']
    });
    
    if (!materialVisibilityStudent) {
      return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    }
    
    res.status(200).json(materialVisibilityStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id);
    if (!materialVisibilityStudent) return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    
    await materialVisibilityStudent.update(req.body);
    res.status(200).json(materialVisibilityStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id);
    if (!materialVisibilityStudent) return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    
    await materialVisibilityStudent.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};