const { Material } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

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
    const { where, order } = parseQueryParams(req.query);
    const materials = await Material.findAll({ where: where || undefined, order: order || undefined });
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