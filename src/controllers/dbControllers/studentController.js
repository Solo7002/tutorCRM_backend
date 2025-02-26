const { Group, Student, Course, Subject, User, GroupStudent, MarkHistory, PlannedLesson, Teacher, HomeTask } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const { convertStandardTimeZoneToUTC } = require('../../utils/dbUtils/timeUtils');


exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const students = await Student.findAll({ where: where || undefined, order: order || undefined });
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { schoolName, grade } = req.query;
    let whereConditions = {};

    if (schoolName) whereConditions.SchoolName = { [Op.like]: `%${schoolName}%` };
    if (grade) whereConditions.Grade = { [Op.like]: `%${grade}%` };

    const students = await Student.findAll({
      where: whereConditions,
    });

    if (!students.length) return res.status(404).json({ success: false, message: 'No students found.' });

    return res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.status(200).json(student);
  } catch (error) {
    console.error('Error in updateStudent:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error in deleteStudent:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getLeadersInGroupsByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (isNaN(studentId) || studentId <= 0) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const groups = await Group.findAll({
      include: [
        {
          model: Course,
          as: 'Course',
          required: true,
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['SubjectName'],
              required: true,
            },
          ],
        },
        {
          model: Student,
          as: 'Students',
          through: { attributes: [] },
          required: false,
        },
      ],
      where: {
        '$Students.StudentId$': studentId,
      },
    });

    if (!groups.length) {
      console.log(`No groups found for student with ID: ${studentId}`);
      return res.status(404).json({ message: 'No groups found for the student' });
    }

    const leaders = [];
    for (const group of groups) {
      if (!group.Course || !group.Course.Subject) {
        console.warn(`Group ${group.GroupId} has no associated course or subject.`);
        continue;
      }

      const subject = group.Course.Subject.SubjectName;

      const studentsInGroup = await GroupStudent.findAll({
        include: [
          {
            model: Student,
            as: 'Student',
            include: [
              {
                model: User,
                as: 'User',
                attributes: ['FirstName', 'LastName', 'ImageFilePath', 'Email'],
                required: true,
              },
            ],
          },
        ],
        where: {
          GroupId: group.GroupId,
        },
      });

      studentsInGroup.forEach(groupStudent => {
        const student = groupStudent.Student;
        if (!student || !student.User) {
          console.warn(`No student or user found in group ${group.GroupId}`);
          return;
        }

        leaders.push({
          name: `${student.User.FirstName} ${student.User.LastName}`,
          subject,
          image: student.User.ImageFilePath || '/assets/images/avatar.jpg',
          email: student.User.Email,
        });
      });
    }

    res.status(200).json(leaders);
  } catch (error) {
    console.error('Error in getLeadersInGroupsByStudentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMarksByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (isNaN(studentId) || studentId <= 0) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const marks = await MarkHistory.findAll({
      include: [
        {
          model: Student,
          as: 'Student',
          required: true,
          attributes: [],
        },
        {
          model: Course,
          as: 'Course',
          required: true,
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['SubjectName'],
              required: true,
            },
          ],
        },
      ],
      where: {
        StudentId: studentId,
      },
      attributes: ['Mark', 'MarkDate', 'MarkType'],
    });

    if (!marks.length) {
      console.log(`No marks found for student with ID: ${studentId}`);
      return res.status(404).json({ message: 'No marks found for the student' });
    }

    const grades = marks.map(mark => ({
      subject: mark.Course.Subject.SubjectName,
      grade: mark.Mark,
      date: mark.MarkDate ? mark.MarkDate.toISOString().split('T')[0] : null,
      type: mark.MarkType.charAt(0).toUpperCase() + mark.MarkType.slice(1),
    }));

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error in getMarksByStudentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEventsByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (isNaN(studentId) || studentId <= 0) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const events = await PlannedLesson.findAll({
      include: [
        {
          model: Group,
          as: 'Group',
          required: true,
          include: [
            {
              model: Course,
              as: 'Course',
              required: true,
              include: [
                {
                  model: Subject,
                  as: 'Subject',
                  attributes: ['SubjectName'],
                  required: true,
                },
                {
                  model: Teacher,
                  as: 'Teacher',
                  required: true,
                  include: [
                    {
                      model: User,
                      as: 'User',
                      attributes: ['ImageFilePath'],
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              model: Student,
              as: 'Students',
              where: { StudentId: studentId },
              required: true,
            },
          ],
        },
      ],
      attributes: ['LessonHeader', 'LessonDate', 'LessonTime', 'TimeZone'],
    });

    if (!events.length) {
      console.log(`No events found for student with ID: ${studentId}`);
      return res.status(404).json({ message: 'No events found for the student' });
    }

    const formattedEvents = events.map(event => {
      const lessonDate = moment(event.LessonDate).tz(event.Group.Course.TimeZone || event.TimeZone).format('YYYY-MM-DD');
      const convertedTimeZone = convertStandardTimeZoneToUTC(event.TimeZone);

      return {
        title: event.Group.Course.Subject.SubjectName, // Название предмета через группу и курс
        date: lessonDate, // Дата в формате YYYY-MM-DD
        time: event.LessonTime, // Время в формате 'HH:MM - HH:MM'
        image: event.Group.Course.Teacher.User.ImageFilePath || '/assets/images/avatar.jpg', // Аватар преподавателя через курс
        link: '/', // Ссылка (заглушка)
        timeZone: convertedTimeZone, // Преобразованный часовой пояс
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error in getEventsByStudentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDaysByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (isNaN(studentId) || studentId <= 0) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const groups = await Group.findAll({
      include: [
        {
          model: Student,
          as: 'Students',
          where: { StudentId: studentId },
          required: true,
        },
        {
          model: PlannedLesson,
          as: 'PlannedLessons',
          required: false,
          attributes: ['LessonDate'],
        },
        {
          model: HomeTask,
          as: 'HomeTasks',
          required: false,
          attributes: ['DeadlineDate'],
        },
      ],
    });

    if (!groups.length) {
      console.log(`No groups found for student with ID: ${studentId}`);
      return res.status(404).json({ message: 'No groups found for the student' });
    }

    const days = [];
    groups.forEach(group => {
      if (group.PlannedLessons && group.PlannedLessons.length > 0) {
        group.PlannedLessons.forEach(plannedLesson => {
          const lessonDate = moment(plannedLesson.LessonDate).format('YYYY-MM-DD');

          days.push({
            date: lessonDate,
            type: 'Lesson',
          });
        });
      }

      if (group.HomeTasks && group.HomeTasks.length > 0) {
        group.HomeTasks.forEach(homeTask => {
          const deadlineDate = moment(homeTask.DeadlineDate).format('YYYY-MM-DD');

          days.push({
            date: deadlineDate,
            type: 'Homework',
          });
        });
      }
    });

    const uniqueDays = Array.from(new Set(days.map(day => day.date)), date => ({
      date,
      type: days.find(dayObj => dayObj.date === date).type,
    }));

    res.status(200).json(uniqueDays);
  } catch (error) {
    console.error('Error in getDaysByStudentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};