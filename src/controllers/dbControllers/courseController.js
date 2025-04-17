const { Course, Teacher, Subject, Location  } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const courses = await Course.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchCourses = async (req, res) => {
  try {
    const { courseName, teacherId, subjectId, locationId } = req.query;
    const whereConditions = {};

    if (courseName) whereConditions.CourseName = { [Op.like]: `%${courseName}%` };
    if (teacherId) whereConditions.TeacherId = teacherId;
    if (subjectId) whereConditions.SubjectId = subjectId;
    if (locationId) whereConditions.LocationId = locationId;

    const courses = await Course.findAll({
      where: whereConditions,
      include: [
        { model: Teacher, as: 'Teacher', attributes: ['TeacherId', 'Name'] },
        { model: Subject, as: 'Subject', attributes: ['SubjectId', 'SubjectName'] },
        { model: Location, as: 'Location', attributes: ['LocationId', 'LocationName'] }
      ]
    });

    if (!courses.length) return res.status(404).json({ success: false, message: 'No courses found matching the criteria.' });

    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    
    await course.update(req.body);
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    
    await course.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCoursesByTeacherId = async (req, res) => {
  try {
    const { id } = req.params; 

    const courses = await Course.findAll({
      where: { TeacherId: id },
      attributes: ["CourseId", "CourseName"],
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error in getCoursesByTeacher:", error);
    res.status(400).json({ error: error.message });
  }
};