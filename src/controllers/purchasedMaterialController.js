const { PurchasedMaterial } = require('../models/purchasedMaterial');

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
    const purchasedMaterials = await PurchasedMaterial.findAll();
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