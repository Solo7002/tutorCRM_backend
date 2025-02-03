const { MaterialVisibilityStudent, Material, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.create(req.body);
    res.status(201).json(materialVisibilityStudent);
  } catch (error) {
    console.error('Error in createMaterialVisibilityStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialVisibilityStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const materialVisibilityStudents = await MaterialVisibilityStudent.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(materialVisibilityStudents);
  } catch (error) {
    console.error('Error in getMaterialVisibilityStudents:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialVisibilityStudentById = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id);

    if (!materialVisibilityStudent) {
      return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    }

    res.status(200).json(materialVisibilityStudent);
  } catch (error) {
    console.error('Error in getMaterialVisibilityStudentById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchMaterialVisibility = async (req, res) => {
  try {
    const { materialId, studentId } = req.query;
    const whereConditions = {};

    if (materialId) whereConditions.MaterialId = materialId;
    if (studentId) whereConditions.StudentId = studentId;

    const materialVisibility = await MaterialVisibilityStudent.findAll({
      where: whereConditions,
      include: [
        {
          model: Material,
          as: 'Material',
          attributes: ['MaterialId', 'MaterialName'],
        },
        {
          model: Student,
          as: 'Student',
          attributes: ['StudentId', 'FirstName', 'LastName'],
        },
      ],
    });

    if (!materialVisibility.length) {
      return res.status(404).json({ success: false, message: 'No material visibility records found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: materialVisibility });
  } catch (error) {
    console.error('Error in searchMaterialVisibility:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id);

    if (!materialVisibilityStudent) {
      return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    }

    await materialVisibilityStudent.update(req.body);
    res.status(200).json(materialVisibilityStudent);
  } catch (error) {
    console.error('Error in updateMaterialVisibilityStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMaterialVisibilityStudent = async (req, res) => {
  try {
    const materialVisibilityStudent = await MaterialVisibilityStudent.findByPk(req.params.id);

    if (!materialVisibilityStudent) {
      return res.status(404).json({ error: "MaterialVisibilityStudent not found" });
    }

    await materialVisibilityStudent.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteMaterialVisibilityStudent:', error);
    res.status(400).json({ error: error.message });
  }
};