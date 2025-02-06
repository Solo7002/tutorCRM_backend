const { SelectedAnswer } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createSelectedAnswer = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.create(req.body);
    res.status(201).json(selectedAnswer);
  } catch (error) {
    console.error('Error in createSelectedAnswer:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getSelectedAnswers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const selectedAnswers = await SelectedAnswer.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(selectedAnswers);
  } catch (error) {
    console.error('Error in getSelectedAnswers:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getSelectedAnswerById = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.findByPk(req.params.id);
    if (!selectedAnswer) return res.status(404).json({ error: "SelectedAnswer not found" });
    res.status(200).json(selectedAnswer);
  } catch (error) {
    console.error('Error in getSelectedAnswerById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchSelectedAnswers = async (req, res) => {
  try {
    const { testQuestionId, doneTestId } = req.query;
    const whereConditions = {};

    if (testQuestionId) whereConditions.TestQuestionId = testQuestionId;
    if (doneTestId) whereConditions.DoneTestId = doneTestId;

    const selectedAnswers = await SelectedAnswer.findAll({
      where: whereConditions,
    });

    if (!selectedAnswers.length) {
      return res.status(404).json({ success: false, message: 'No selected answers found.' });
    }

    return res.status(200).json({ success: true, data: selectedAnswers });
  } catch (error) {
    console.error('Error in searchSelectedAnswers:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateSelectedAnswer = async (req, res) => {
  try {
    const selectedAnswer = await SelectedAnswer.findByPk(req.params.id);
    if (!selectedAnswer) return res.status(404).json({ error: "SelectedAnswer not found" });

    await selectedAnswer.update(req.body);
    res.status(200).json(selectedAnswer);
  } catch (error) {
    console.error('Error in updateSelectedAnswer:', error);
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
    console.error('Error in deleteSelectedAnswer:', error);
    res.status(400).json({ error: error.message });
  }
};