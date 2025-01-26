const { HomeTaskFile } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

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