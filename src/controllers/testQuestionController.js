const { TestQuestion } = require('../models');

exports.createTestQuestion = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.create(req.body);
    res.status(201).json(testQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestQuestions = async (req, res) => {
  try {
    const testQuestions = await TestQuestion.findAll();
    res.status(200).json(testQuestions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestQuestionById = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.findByPk(req.params.id);
    if (!testQuestion) return res.status(404).json({ error: "TestQuestion not found" });
    res.status(200).json(testQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTestQuestion = async (req, res) => {
  try {
    const testQuestion = await TestQuestion.findByPk(req.params.id);
    if (!testQuestion) return res.status(404).json({ error: "TestQuestion not found" });
    
    await testQuestion.update(req.body);
    res.status(200).json(testQuestion);
  } catch (error) {
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
    res.status(400).json({ error: error.message });
  }
};