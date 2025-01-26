const { HomeTask } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.create(req.body);
    res.status(201).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const HomeTasks = await HomeTask.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(HomeTasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTaskById = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    res.status(200).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    
    await HomeTask.update(req.body);
    res.status(200).json(HomeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHomeTask = async (req, res) => {
  try {
    const HomeTask = await HomeTask.findByPk(req.params.id);
    if (!HomeTask) return res.status(404).json({ error: "HomeTask not found" });
    
    await HomeTask.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};