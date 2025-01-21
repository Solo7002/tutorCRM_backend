const { TestAnswer } = require('../models/testAnswer');

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
    const testAnswers = await TestAnswer.findAll();
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