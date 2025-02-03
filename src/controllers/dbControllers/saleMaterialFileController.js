const { SaleMaterialFile } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createSaleMaterialFile = async (req, res) => {
  try {
    const saleMaterialFile = await SaleMaterialFile.create(req.body);
    res.status(201).json(saleMaterialFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSaleMaterialFiles = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const saleMaterialFiles = await SaleMaterialFile.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(saleMaterialFiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSaleMaterialFileById = async (req, res) => {
  try {
    const saleMaterialFile = await SaleMaterialFile.findByPk(req.params.id);
    if (!saleMaterialFile) return res.status(404).json({ error: "SaleMaterialFile not found" });
    res.status(200).json(saleMaterialFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchSaleMaterialFiles = async (req, res) => {
  try {
    const { filePath, fileName, appearedDate, saleMaterialId, purchasedMaterialId } = req.query;
    let whereConditions = {};

    if (filePath) whereConditions.FilePath = { [Op.like]: `%${filePath}%` };
    if (fileName) whereConditions.FileName = { [Op.like]: `%${fileName}%` };
    if (appearedDate) whereConditions.AppearedDate = { [Op.gte]: new Date(appearedDate) };
    if (saleMaterialId) whereConditions.SaleMaterialId = saleMaterialId;
    if (purchasedMaterialId) whereConditions.PurchasedMaterialId = purchasedMaterialId;

    const saleMaterialFiles = await SaleMaterialFile.findAll({
      where: whereConditions,
    });

    if (!saleMaterialFiles.length) return res.status(404).json({ success: false, message: 'No sale material files found matching the criteria.' });

    return res.status(200).json({ success: true, data: saleMaterialFiles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateSaleMaterialFile = async (req, res) => {
  try {
    const saleMaterialFile = await SaleMaterialFile.findByPk(req.params.id);
    if (!saleMaterialFile) return res.status(404).json({ error: "SaleMaterialFile not found" });
    
    await saleMaterialFile.update(req.body);
    res.status(200).json(saleMaterialFile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSaleMaterialFile = async (req, res) => {
  try {
    const saleMaterialFile = await SaleMaterialFile.findByPk(req.params.id);
    if (!saleMaterialFile) return res.status(404).json({ error: "SaleMaterialFile not found" });
    
    await saleMaterialFile.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};