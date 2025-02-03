const { DoneHomeTaskFile } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.create(req.body);
    res.status(201).json(doneHometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskFiles = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneHometaskFiles = await DoneHometaskFile.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(doneHometaskFiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskFileById = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHometaskFile not found" });
    res.status(200).json(doneHometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchDoneHomeTaskFiles = async (req, res) => {
  try {
    const { fileName, doneHomeTaskId, filePath } = req.query;
    let whereConditions = {};

    if (fileName) whereConditions.FileName = { [Op.like]: `%${fileName}%` };
    if (doneHomeTaskId) whereConditions.DoneHomeTaskId = doneHomeTaskId;
    if (filePath) whereConditions.FilePath = { [Op.like]: `%${filePath}%` };

    const files = await DoneHomeTaskFile.findAll({
      where: whereConditions,
      include: [
        { model: DoneHomeTask, as: 'DoneHomeTask', attributes: ['DoneHomeTaskId', 'Mark'] }
      ]
    });

    if (!files.length) return res.status(404).json({ success: false, message: 'No files found matching the criteria.' });
    return res.status(200).json({ success: true, data: files });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHometaskFile not found" });
    
    await doneHometaskFile.update(req.body);
    res.status(200).json(doneHometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHometaskFile not found" });
    
    await doneHometaskFile.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};