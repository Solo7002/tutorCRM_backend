const { SaleMaterial } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

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
    const { where, order } = parseQueryParams(req.query);
    const saleMaterials = await SaleMaterial.findAll({ where: where || undefined, order: order || undefined });
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

exports.searchSaleMaterials = async (req, res) => {
  try {
    const { materialsHeader, price, vendorId } = req.query;
    let whereConditions = {};

    if (materialsHeader) whereConditions.MaterialsHeader = { [Op.like]: `%${materialsHeader}%` };
    if (price) whereConditions.Price = price;
    if (vendorId) whereConditions.VendorldId = vendorId;

    const saleMaterials = await SaleMaterial.findAll({
      where: whereConditions,
    });

    if (!saleMaterials.length) return res.status(404).json({ success: false, message: 'No sale materials found matching the criteria.' });

    return res.status(200).json({ success: true, data: saleMaterials });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
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