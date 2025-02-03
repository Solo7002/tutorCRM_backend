const { PurchasedMaterial } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createPurchasedMaterial = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.create(req.body);
    res.status(201).json(purchasedMaterial);
  } catch (error) {
    console.error('Error in createPurchasedMaterial:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPurchasedMaterials = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const purchasedMaterials = await PurchasedMaterial.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(purchasedMaterials);
  } catch (error) {
    console.error('Error in getPurchasedMaterials:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPurchasedMaterialById = async (req, res) => {
  try {
    const purchasedMaterial = await PurchasedMaterial.findByPk(req.params.id);
    if (!purchasedMaterial) return res.status(404).json({ error: "PurchasedMaterial not found" });
    res.status(200).json(purchasedMaterial);
  } catch (error) {
    console.error('Error in getPurchasedMaterialById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchPurchasedMaterials = async (req, res) => {
  try {
    const { startDate, endDate, materialId, purchaserId } = req.query;
    const whereConditions = {};

    if (startDate && endDate) {
      whereConditions.PurchasedDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.PurchasedDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.PurchasedDate = { [Op.lte]: new Date(endDate) };
    }

    if (materialId) whereConditions.SaleMaterialId = materialId;
    if (purchaserId) whereConditions.PurchaserId = purchaserId;

    const purchasedMaterials = await PurchasedMaterial.findAll({
      where: whereConditions,
    });

    if (!purchasedMaterials.length) {
      return res.status(404).json({ success: false, message: 'No purchased materials found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: purchasedMaterials });
  } catch (error) {
    console.error('Error in searchPurchasedMaterials:', error);
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
    console.error('Error in updatePurchasedMaterial:', error);
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
    console.error('Error in deletePurchasedMaterial:', error);
    res.status(400).json({ error: error.message });
  }
};