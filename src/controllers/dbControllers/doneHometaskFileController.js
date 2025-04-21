const { DoneHomeTaskFile, DoneHomeTask } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.create(req.body);
    res.status(201).json(doneHometaskFile);
  } catch (error) {
    console.error('Error in createDoneHometaskFile:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskFiles = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneHometaskFiles = await DoneHomeTaskFile.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(doneHometaskFiles);
  } catch (error) {
    console.error('Error in getDoneHometaskFiles:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskFileById = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHomeTaskFile not found" });
    res.status(200).json(doneHometaskFile);
  } catch (error) {
    console.error('Error in getDoneHometaskFileById:', error);
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
        { model: DoneHomeTask, as: 'DoneHomeTask', attributes: ['DoneHomeTaskId', 'Mark'] },
      ],
    });

    if (!files.length) {
      return res.status(404).json({ success: false, message: 'No files found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: files });
  } catch (error) {
    console.error('Error in searchDoneHomeTaskFiles:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHomeTaskFile not found" });

    await doneHometaskFile.update(req.body);
    res.status(200).json(doneHometaskFile);
  } catch (error) {
    console.error('Error in updateDoneHometaskFile:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometaskFile = async (req, res) => {
  try {
    const doneHometaskFile = await DoneHomeTaskFile.findByPk(req.params.id);
    if (!doneHometaskFile) return res.status(404).json({ error: "DoneHomeTaskFile not found" });

    await doneHometaskFile.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteDoneHometaskFile:', error);
    res.status(400).json({ error: error.message });
  }
};



exports.getDoneHometaskFilesByDoneHomeTaskId = async (req, res) => {
  try {
    const { DoneHomeTaskId } = req.params;
    
 
    if (!DoneHomeTaskId || isNaN(DoneHomeTaskId)) {
      return res.status(400).json({ message: 'DoneHomeTaskId is required and must be a number' });
    }

 
    const doneHometaskFiles = await DoneHomeTaskFile.findAll({
      where: { DoneHomeTaskId },
    });
 
    res.status(200).json(doneHometaskFiles);
  } catch (error) {
    console.error('Error in getDoneHometaskFiles:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getOldDoneHometaskFilePaths= async()=>{
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() -90);

  const oldFiles = await DoneHomeTaskFile.findAll({
      where: {
          createdAt: {
              [Op.lt]: ninetyDaysAgo
          }
      },
      attributes: ['FilePath']
  });

  return oldFiles.map(file => file.FilePath);
}