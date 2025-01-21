const { PlanedLesson } = require('../models/plannedLesson');

exports.createPlanedLesson = async (req, res) => {
  try {
    const planedLesson = await PlanedLesson.create(req.body);
    res.status(201).json(planedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlanedLessons = async (req, res) => {
  try {
    const planedLessons = await PlanedLesson.findAll();
    res.status(200).json(planedLessons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlanedLessonById = async (req, res) => {
  try {
    const planedLesson = await PlanedLesson.findByPk(req.params.id);
    if (!planedLesson) return res.status(404).json({ error: "PlanedLesson not found" });
    res.status(200).json(planedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePlanedLesson = async (req, res) => {
  try {
    const planedLesson = await PlanedLesson.findByPk(req.params.id);
    if (!planedLesson) return res.status(404).json({ error: "PlanedLesson not found" });
    
    await planedLesson.update(req.body);
    res.status(200).json(planedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlanedLesson = async (req, res) => {
  try {
    const planedLesson = await PlanedLesson.findByPk(req.params.id);
    if (!planedLesson) return res.status(404).json({ error: "PlanedLesson not found" });
    
    await planedLesson.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};