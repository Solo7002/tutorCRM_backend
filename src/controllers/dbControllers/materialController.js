const { Material } = require('../../models/dbModels');

exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();
    res.status(200).json(materials);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.status(200).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    await material.update(req.body);
    res.status(200).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    await material.destroy();
    res.status(200).json({ message: 'Material deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};