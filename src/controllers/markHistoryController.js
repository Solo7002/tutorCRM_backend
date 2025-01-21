const { MarkHistory } = require('../models/markHistory');

exports.createMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.create(req.body);
    res.status(201).json(markHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMarkHistories = async (req, res) => {
  try {
    const markHistories = await MarkHistory.findAll();
    res.status(200).json(markHistories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMarkHistoryById = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });
    res.status(200).json(markHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });
    
    await markHistory.update(req.body);
    res.status(200).json(markHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMarkHistory = async (req, res) => {
  try {
    const markHistory = await MarkHistory.findByPk(req.params.id);
    if (!markHistory) return res.status(404).json({ error: "MarkHistory not found" });
    
    await markHistory.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};