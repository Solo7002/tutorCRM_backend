const { where } = require('../../config/database');
const { Teacher,HomeTask,Group,User,Course,UserReview} = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const teachers = await Teacher.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error in getTeacherById:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.searchTeachers = async (req, res) => {
  try {
    const { lessonType, meetingType, aboutTeacher, UserId } = req.query;
    let whereConditions = {};
    if (lessonType) whereConditions.LessonType = lessonType;
    if (meetingType) whereConditions.MeetingType = meetingType;
    if (UserId) whereConditions.UserId = UserId;
    if (aboutTeacher) whereConditions.AboutTeacher = { [Op.like]: `%${aboutTeacher}%` };

    const teachers = await Teacher.findAll({
      where: whereConditions,
    });

    if (!teachers.length) {
      return res.status(404).json({ success: false, message: 'No teachers found.' });
    }

    return res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    console.error('Error in searchTeachers:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getAllAboutTeacher = async (req, res) => {
  try {
    const { UserId } = req.query;
    let whereConditions = {};
    if (UserId) whereConditions.UserId = UserId;

    const teacher = (await Teacher.findAll({
      where: whereConditions,
    }))[0];

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'No teachers found.' });
    }
    const courses = await Course.findAll({
        where: {
            TeacherId: teacher.TeacherId
        }
    });
    const reviews = await UserReview.findAll({
        where: {
            //UserIdFor: UserId
        }
    });

    return res.status(200).json({ teacher, courses, reviews });
  } catch (error) {
    console.error('Error in searchTeachers:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.update(req.body);
    res.status(200).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await teacher.destroy();
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.getNameTeacherByIdHometask = async (req, res) => {
  try {
      const { teacherId } = req.params;

      const homeTask = await HomeTask.findByPk(teacherId, {
          include: {
              model: Group,
              as: 'Group',
              include: {
                  model: Course,
                  as: 'Course',
                  include: {
                      model: Teacher,
                      as: 'Teacher',
                      include: {
                          model: User,
                          as: 'User',
                          attributes: ['FirstName', 'LastName']
                      }
                  }
              }
          }
      });
     
      if (!homeTask?.Group?.Course?.Teacher?.User) {
          return res.status(404).json({ message: 'Не удалось найти преподавателя' });
      }

      res.json({
          FirstName: homeTask.Group.Course.Teacher.User.FirstName,
          LastName: homeTask.Group.Course.Teacher.User.LastName
      });

  } catch (error) {
     
      res.status(500).json({ message: 'Error teacher:', error: error.message });
  }
};