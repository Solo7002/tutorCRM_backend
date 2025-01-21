const { SaleMaterialFile } = require('../models/saleMaterialFile');

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
    const saleMaterialFiles = await SaleMaterialFile.findAll();
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