const { PlannedLesson } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createPlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.create(req.body);
    res.status(201).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessons = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const PlannedLessons = await PlannedLesson.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(PlannedLessons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessonById = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    res.status(200).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    
    await PlannedLesson.update(req.body);
    res.status(200).json(PlannedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlannedLesson = async (req, res) => {
  try {
    const PlannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!PlannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    
    await PlannedLesson.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};