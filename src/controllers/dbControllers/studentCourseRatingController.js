const { StudentCourseRating } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');

exports.createStudentCourseRating = async (req, res) => {
  try {
    const studentCourseRating = await StudentCourseRating.create(req.body);
    res.status(201).json(studentCourseRating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentCourseRatings = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const studentCourseRatings = await StudentCourseRating.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(studentCourseRatings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentCourseRatingById = async (req, res) => {
  try {
    const studentCourseRating = await StudentCourseRating.findByPk(req.params.id);
    if (!studentCourseRating) return res.status(404).json({ error: "StudentCourseRating not found" });
    res.status(200).json(studentCourseRating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStudentCourseRating = async (req, res) => {
  try {
    const studentCourseRating = await StudentCourseRating.findByPk(req.params.id);
    if (!studentCourseRating) return res.status(404).json({ error: "StudentCourseRating not found" });
    
    await studentCourseRating.update(req.body);
    res.status(200).json(studentCourseRating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudentCourseRating = async (req, res) => {
  try {
    const studentCourseRating = await StudentCourseRating.findByPk(req.params.id);
    if (!studentCourseRating) return res.status(404).json({ error: "StudentCourseRating not found" });
    
    await studentCourseRating.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};