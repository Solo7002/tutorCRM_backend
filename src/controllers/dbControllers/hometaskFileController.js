const { HomeTaskFile, HomeTask } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createHometaskFile = async (req, res) => {
  try {
    const hometaskFile = await HomeTaskFile.create(req.body);
    res.status(201).json(hometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHometaskFiles = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const hometaskFiles = await HomeTaskFile.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(hometaskFiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHometaskFileById = async (req, res) => {
  try {
    const hometaskFile = await HomeTaskFile.findByPk(req.params.id);
    if (!hometaskFile) return res.status(404).json({ error: "HometaskFile not found" });
    res.status(200).json(hometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchHomeTaskFiles = async (req, res) => {
  try {
    const { fileName, homeTaskId } = req.query;
    let whereConditions = {};

    if (fileName) whereConditions.FileName = { [Op.like]: `%${fileName}%` };
    if (homeTaskId) whereConditions.HomeTaskId = homeTaskId;

    const homeTaskFiles = await HomeTaskFile.findAll({
      where: whereConditions,
      include: {
        model: HomeTask,
        as: 'HomeTask',
        attributes: ['HomeTaskId', 'HomeTaskHeader'],
      }
    });

    if (!homeTaskFiles.length) return res.status(404).json({ success: false, message: 'No home task files found matching the criteria.' });

    return res.status(200).json({ success: true, data: homeTaskFiles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateHometaskFile = async (req, res) => {
  try {
    const hometaskFile = await HomeTaskFile.findByPk(req.params.id);
    if (!hometaskFile) return res.status(404).json({ error: "HometaskFile not found" });
    
    await hometaskFile.update(req.body);
    res.status(200).json(hometaskFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHometaskFile = async (req, res) => {
  try {
    const hometaskFile = await HomeTaskFile.findByPk(req.params.id);
    if (!hometaskFile) return res.status(404).json({ error: "HometaskFile not found" });
    
    await hometaskFile.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};