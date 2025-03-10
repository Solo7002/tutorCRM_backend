const { PlannedLesson,Course,Group } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const { isValidTimeZone } = require('../../utils/dbUtils/timeUtils');

exports.createPlannedLesson = async (req, res) => {
  try {
    const { LessonHeader, GroupId, StartLessonTime, EndLessonTime, LessonType, LessonAddress, LessonLink,LessonDate } = req.body;

    const plannedLesson = await PlannedLesson.create({
      LessonHeader,
      GroupId,
      StartLessonTime,
      EndLessonTime,
      LessonType,
      LessonAddress,
      LessonLink,
      LessonDate
    });

    res.status(201).json(plannedLesson);
  } catch (error) {
    console.error('Error in createPlannedLesson:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessons = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const plannedLessons = await PlannedLesson.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(plannedLessons);
  } catch (error) {
    console.error('Error in getPlannedLessons:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessonById = async (req, res) => {
  try {
    const plannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!plannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });
    res.status(200).json(plannedLesson);
  } catch (error) {
    console.error('Error in getPlannedLessonById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchPlannedLessons = async (req, res) => {
  try {
    const { lessonHeader, lessonPrice, isPaid, groupId } = req.query;
    const whereConditions = {};

    if (lessonHeader) whereConditions.LessonHeader = { [Op.like]: `%${lessonHeader}%` };
    if (lessonPrice) whereConditions.LessonPrice = parseFloat(lessonPrice);
    if (isPaid !== undefined) whereConditions.IsPaid = isPaid === 'true';
    if (groupId) whereConditions.GroupId = groupId;

    const plannedLessons = await PlannedLesson.findAll({
      where: whereConditions,
    });

    if (!plannedLessons.length) {
      return res.status(404).json({ success: false, message: 'No planned lessons found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: plannedLessons });
  } catch (error) {
    console.error('Error in searchPlannedLessons:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updatePlannedLesson = async (req, res) => {
  try {
    const plannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!plannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });

    await plannedLesson.update(req.body);
    res.status(200).json(plannedLesson);
  } catch (error) {
    console.error('Error in updatePlannedLesson:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deletePlannedLesson = async (req, res) => {
  try {
    const plannedLesson = await PlannedLesson.findByPk(req.params.id);
    if (!plannedLesson) return res.status(404).json({ error: "PlannedLesson not found" });

    await plannedLesson.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deletePlannedLesson:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPlannedLessonByTeacherId = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { TeacherId: req.params.teacherId },
      include: [
        {
          model: Group,
          as: 'Groups',
          attributes: ['GroupName'],
          include: [
            {
              model: PlannedLesson,
              as: 'PlannedLessons',
            },
          ],
        },
      ],
    });

    let plannedLessons = [];
    courses.forEach(course => {
      course.Groups.forEach(group => {
        const lessonsWithGroupName = group.PlannedLessons.map(lesson => ({
          ...lesson.toJSON(),
          GroupName: group.GroupName, 
        }));
        plannedLessons = plannedLessons.concat(lessonsWithGroupName);
      });
    });

    if (plannedLessons.length === 0) {
      return res.status(404).json({ error: "No planned lessons found for this teacher" });
    }

    res.status(200).json(plannedLessons);
  } catch (error) {
    console.error('Error in getPlannedLessonByTeacherId:', error);
    res.status(400).json({ error: error.message });
  }
};