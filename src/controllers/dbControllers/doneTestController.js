const { DoneTest, Student, Test } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.create(req.body);
    res.status(201).json(doneTest);
  } catch (error) {
    console.error('Error in createDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTests = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneTests = await DoneTest.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(doneTests);
  } catch (error) {
    console.error('Error in getDoneTests:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTestById = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });
    res.status(200).json(doneTest);
  } catch (error) {
    console.error('Error in getDoneTestById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchDoneTests = async (req, res) => {
  try {
    const { mark, startDate, endDate, studentId, testId } = req.query;
    const whereConditions = {};

    if (mark) whereConditions.Mark = { [Op.eq]: mark };
    if (startDate && endDate) {
      whereConditions.DoneDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.DoneDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.DoneDate = { [Op.lte]: new Date(endDate) };
    }
    if (studentId) whereConditions.StudentId = studentId;
    if (testId) whereConditions.TestId = testId;

    const doneTests = await DoneTest.findAll({
      where: whereConditions,
      include: [
        { model: Student, as: 'Student', attributes: ['StudentId', 'FirstName', 'LastName'] },
        { model: Test, as: 'Test', attributes: ['TestId', 'TestName'] },
      ],
    });

    if (!doneTests.length) {
      return res.status(404).json({ success: false, message: 'No tests found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: doneTests });
  } catch (error) {
    console.error('Error in searchDoneTests:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });

    await doneTest.update(req.body);
    res.status(200).json(doneTest);
  } catch (error) {
    console.error('Error in updateDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });

    await doneTest.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};