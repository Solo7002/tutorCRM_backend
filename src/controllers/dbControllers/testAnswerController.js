const { TestAnswer } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTestAnswer = async (req, res) => {
  try {
    const testAnswer = await TestAnswer.create(req.body);
    res.status(201).json(testAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestAnswers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const testAnswers = await TestAnswer.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(testAnswers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestAnswerById = async (req, res) => {
  try {
    const testAnswer = await TestAnswer.findByPk(req.params.id);
    if (!testAnswer) return res.status(404).json({ error: "TestAnswer not found" });
    res.status(200).json(testAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchTestAnswers = async (req, res) => {
  try {
    const { answerText, isRightAnswer } = req.query;
    let whereConditions = {};

    if (answerText) whereConditions.AnswerText = { [Op.like]: `%${answerText}%` };
    if (isRightAnswer !== undefined) whereConditions.IsRightAnswer = isRightAnswer === 'true';

    const testAnswers = await TestAnswer.findAll({
      where: whereConditions,
      attributes: ['TestAnswerId', 'AnswerText', 'ImagePath', 'IsRightAnswer'],
    });

    if (!testAnswers.length) {
      return res.status(404).json({ success: false, message: 'No test answers found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: testAnswers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateTestAnswer = async (req, res) => {
  try {
    const testAnswer = await TestAnswer.findByPk(req.params.id);
    if (!testAnswer) return res.status(404).json({ error: "TestAnswer not found" });
    
    await testAnswer.update(req.body);
    res.status(200).json(testAnswer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTestAnswer = async (req, res) => {
  try {
    const testAnswer = await TestAnswer.findByPk(req.params.id);
    if (!testAnswer) return res.status(404).json({ error: "TestAnswer not found" });
    
    await testAnswer.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};