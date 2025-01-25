const { SaleMaterial } = require('../../models/dbModels');

exports.createSaleMaterial = async (req, res) => {
  try {
    const saleMaterial = await SaleMaterial.create(req.body);
    res.status(201).json(saleMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSaleMaterials = async (req, res) => {
  try {
    const saleMaterials = await SaleMaterial.findAll();
    res.status(200).json(saleMaterials);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSaleMaterialById = async (req, res) => {
  try {
    const saleMaterial = await SaleMaterial.findByPk(req.params.id);
    if (!saleMaterial) return res.status(404).json({ error: "SaleMaterial not found" });
    res.status(200).json(saleMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSaleMaterial = async (req, res) => {
  try {
    const saleMaterial = await SaleMaterial.findByPk(req.params.id);
    if (!saleMaterial) return res.status(404).json({ error: "SaleMaterial not found" });
    
    await saleMaterial.update(req.body);
    res.status(200).json(saleMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSaleMaterial = async (req, res) => {
  try {
    const saleMaterial = await SaleMaterial.findByPk(req.params.id);
    if (!saleMaterial) return res.status(404).json({ error: "SaleMaterial not found" });
    
    await saleMaterial.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};