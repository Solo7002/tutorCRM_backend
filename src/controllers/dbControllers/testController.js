const { Test } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    console.error('Error in createTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const tests = await Test.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error in getTests:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    console.error('Error in getTestById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchTests = async (req, res) => {
  try {
    const { testName, testDescription, startDate, endDate } = req.query;
    const whereConditions = {};

    if (testName) whereConditions.TestName = { [Op.like]: `%${testName}%` };
    if (testDescription) whereConditions.TestDescription = { [Op.like]: `%${testDescription}%` };

    if (startDate && endDate) {
      whereConditions.CreatedDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.CreatedDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.CreatedDate = { [Op.lte]: new Date(endDate) };
    }

    const tests = await Test.findAll({
      where: whereConditions,
      attributes: ['TestId', 'TestName', 'TestDescription', 'CreatedDate'],
    });

    if (!tests.length) {
      return res.status(404).json({ success: false, message: 'No tests found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error('Error in searchTests:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    await test.update(req.body);
    res.status(200).json(test);
  } catch (error) {
    console.error('Error in updateTest:', error);
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
    console.error('Error in deleteTest:', error);
    res.status(400).json({ error: error.message });
  }
};