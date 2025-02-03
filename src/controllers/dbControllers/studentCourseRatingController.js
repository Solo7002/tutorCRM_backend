const { StudentCourseRating } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

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

exports.searchStudentCourseRatings = async (req, res) => {
  try {
    const { studentId, courseId, rating } = req.query;
    let whereConditions = {};

    if (studentId) whereConditions.StudentId = studentId;
    if (courseId) whereConditions.CourseId = courseId;
    if (rating) whereConditions.Rating = rating;

    const ratings = await StudentCourseRating.findAll({
      where: whereConditions,
    });

    if (!ratings.length) return res.status(404).json({ success: false, message: 'No ratings found.' });

    return res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
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