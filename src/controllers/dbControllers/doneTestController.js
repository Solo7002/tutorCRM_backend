const { DoneTest } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.create(req.body);
    res.status(201).json(doneTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTests = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneTests = await DoneTest.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(doneTests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTestById = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });
    res.status(200).json(doneTest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });
    
    await doneTest.update(req.body);
    res.status(200).json(doneTest);
  } catch (error) {
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
    res.status(400).json({ error: error.message });
  }
};