const { DoneHomeTask } = require('../models');

exports.createDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.create(req.body);
    res.status(201).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometasks = async (req, res) => {
  try {
    const doneHometasks = await DoneHomeTask.findAll();
    res.status(200).json(doneHometasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskById = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });
    
    await doneHometask.update(req.body);
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });
    
    await doneHometask.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};