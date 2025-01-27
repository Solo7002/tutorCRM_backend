const { PurchasedMaterial } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createPurchasedMaterial = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.create(req.body);
    res.status(201).json(purchasedMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPurchasedMaterials = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const purchasedMaterials = await PurchasedMaterial.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(purchasedMaterials);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPurchasedMaterialById = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.findByPk(req.params.id);
    if (!purchasedMaterial) return res.status(404).json({ error: "PurchasedMaterial not found" });
    res.status(200).json(purchasedMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchPurchasedMaterials = async (req, res) => {
  try {
    const { purchasedDate, materialId, purchaserId } = req.query;
    let whereConditions = {};

    if (purchasedDate) whereConditions.PurchasedDate = { [Op.gte]: new Date(purchasedDate) };
    if (materialId) whereConditions.SaleMaterialId = materialId;
    if (purchaserId) whereConditions.PurchaserId = purchaserId;

    const purchasedMaterials = await PurchasedMaterial.findAll({
      where: whereConditions,
    });

    if (!purchasedMaterials.length) return res.status(404).json({ success: false, message: 'No purchased materials found matching the criteria.' });

    return res.status(200).json({ success: true, data: purchasedMaterials });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updatePurchasedMaterial = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.findByPk(req.params.id);
    if (!purchasedMaterial) return res.status(404).json({ error: "PurchasedMaterial not found" });
    
    await purchasedMaterial.update(req.body);
    res.status(200).json(purchasedMaterial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePurchasedMaterial = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.findByPk(req.params.id);
    if (!purchasedMaterial) return res.status(404).json({ error: "PurchasedMaterial not found" });
    
    await purchasedMaterial.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};