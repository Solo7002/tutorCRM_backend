const { SelectedAnswer } = require('../models');

exports.createSelectedAnswer = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.create(req.body);
    res.status(201).json(selectedAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSelectedAnswers = async (req, res) => {
  try {
    const selectedAnswers = await SelectedAnswer.findAll();
    res.status(200).json(selectedAnswers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSelectedAnswerById = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.findByPk(req.params.id);
    if (!selectedAnswer) return res.status(404).json({ error: "SelectedAnswer not found" });
    res.status(200).json(selectedAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSelectedAnswer = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.findByPk(req.params.id);
    if (!selectedAnswer) return res.status(404).json({ error: "SelectedAnswer not found" });
    
    await selectedAnswer.update(req.body);
    res.status(200).json(selectedAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSelectedAnswer = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.findByPk(req.params.id);
    if (!selectedAnswer) return res.status(404).json({ error: "SelectedAnswer not found" });
    
    await selectedAnswer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};