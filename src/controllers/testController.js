const { Test } = require('../models');

exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.findAll();
    res.status(200).json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    
    await test.update(req.body);
    res.status(200).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    
    await test.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};