const { Hometask } = require('../models/homeTask');

exports.createHometask = async (req, res) => {
  try {
    const hometask = await Hometask.create(req.body);
    res.status(201).json(hometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHometasks = async (req, res) => {
  try {
    const hometasks = await Hometask.findAll();
    res.status(200).json(hometasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHometaskById = async (req, res) => {
  try {
    const hometask = await Hometask.findByPk(req.params.id);
    if (!hometask) return res.status(404).json({ error: "Hometask not found" });
    res.status(200).json(hometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHometask = async (req, res) => {
  try {
    const hometask = await Hometask.findByPk(req.params.id);
    if (!hometask) return res.status(404).json({ error: "Hometask not found" });
    
    await hometask.update(req.body);
    res.status(200).json(hometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHometask = async (req, res) => {
  try {
    const hometask = await Hometask.findByPk(req.params.id);
    if (!hometask) return res.status(404).json({ error: "Hometask not found" });
    
    await hometask.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};