const { TestQuestion } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTestQuestion = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.create(req.body);
    res.status(201).json(testQuestion);
  } catch (error) {
    console.error('Error in createTestQuestion:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestQuestions = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const testQuestions = await TestQuestion.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(testQuestions);
  } catch (error) {
    console.error('Error in getTestQuestions:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestQuestionById = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.findByPk(req.params.id);
    if (!testQuestion) return res.status(404).json({ error: "TestQuestion not found" });
    res.status(200).json(testQuestion);
  } catch (error) {
    console.error('Error in getTestQuestionById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchTestQuestions = async (req, res) => {
  try {
    const { header, description } = req.query;
    const whereConditions = {};

    if (header) whereConditions.TestQuestionHeader = { [Op.like]: `%${header}%` };
    if (description) whereConditions.TestQuestionDescription = { [Op.like]: `%${description}%` };

    const testQuestions = await TestQuestion.findAll({
      where: whereConditions,
      attributes: ['TestQuestionId', 'TestQuestionHeader', 'TestQuestionDescription', 'ImagePath', 'AudioPath'],
    });

    if (!testQuestions.length) {
      return res.status(404).json({ success: false, message: 'No test questions found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: testQuestions });
  } catch (error) {
    console.error('Error in searchTestQuestions:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateTestQuestion = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.findByPk(req.params.id);
    if (!testQuestion) return res.status(404).json({ error: "TestQuestion not found" });

    await testQuestion.update(req.body);
    res.status(200).json(testQuestion);
  } catch (error) {
    console.error('Error in updateTestQuestion:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTestQuestion = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.findByPk(req.params.id);
    if (!testQuestion) return res.status(404).json({ error: "TestQuestion not found" });

    await testQuestion.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTestQuestion:', error);
    res.status(400).json({ error: error.message });
  }
};