const { where } = require('../../config/database');
const { Teacher, HomeTask, Group, User, Course, Student, UserReview, StudentCourseRating, GroupStudent, DoneHomeTask, Subject, PlannedLesson, MarkHistory, OctoCoins, Material, sequelize } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const moment = require('moment');
const momentTimezone = require('moment-timezone');

exports.createTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    const octoCoin = await OctoCoins.create({
      TeacherId: teacher.TeacherId,
      Amount: 0,
    });
    await teacher.update({ OctoCoinId: octoCoin.OctoCoinId });
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
    const userId = req.params.id;

    const user = await User.findByPk(req.params.id);

    const teacher = await Teacher.findOne({
      where: { UserId: userId },
      include: [
        {
          model: Course,
          as: 'Courses',
          include: [
            { model: Subject, as: 'Subject' },
            {
              model: Group,
              as: 'Groups',
              include: [{ model: Student, as: 'Students' }],
            },
          ],
        },
        {
          model: Material,
          as: 'Materials',
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    const courses = teacher.Courses || [];

    const subjectNamesSet = new Set(courses.map(course => course.Subject?.SubjectName).filter(Boolean));
    const subjectNames = Array.from(subjectNamesSet).slice(0, 2).join(', ');

    let minPrice = 100000000000000;

    courses.map(course => {
      course.Groups.map(group => {
        if (group.GroupPrice < minPrice) {
          minPrice = group.GroupPrice;
        }
      });
    });

    const studentsAmount = await GroupStudent.count({
      distinct: true,
      col: 'StudentId',
      include: [
        {
          model: Group,
          as: 'Group',
          include: [
            {
              model: Course,
              as: 'Course',
              where: { TeacherId: teacher.TeacherId },
            },
          ],
        },
      ],
    });

    const reviews = await UserReview.findAll({
      where: { UserIdFor: userId },
    });
    const totalStars = reviews.reduce((sum, review) => sum + review.Stars, 0);
    const rating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : null;

    const materialsCount = teacher.Materials?.length || 0;

    const transformedCourses = courses.map(course => ({
      CourseId: course.CourseId,
      CourseName: course.CourseName,
      SubjectName: course.Subject?.SubjectName || null,
      Groups: course.Groups.map(group => ({
        GroupId: group.GroupId,
        GroupName: group.GroupName,
        GroupPrice: group.GroupPrice,
        GroupAmountOfStudents: group.Students.length,
      })),
    }));

    const teacherData = {
      ...teacher.toJSON(),
      SubjectNames: subjectNames,
      minPrice: minPrice || null,
      StudentsAmount: studentsAmount || 0,
      Rating: rating,
      MaterialsAmount: materialsCount,
    };

    delete teacherData.Courses;
    delete teacherData.Materials;

    return res.status(200).json({ user: user, teacher: teacherData, courses: transformedCourses });
  } catch (error) {
    console.error('Error in getAllAboutTeacher:', error);
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

exports.searchUserByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const teacher = await Teacher.findByPk(teacherId, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'FirstName', 'LastName', 'Email', 'ImageFilePath', 'Username'],
          required: true
        }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.User) {
      return res.status(404).json({ message: 'User not found for this teacher' });
    }

    const userData = {
      userId: teacher.User.UserId,
      username: teacher.User.Username,
      firstName: teacher.User.FirstName,
      lastName: teacher.User.LastName,
      email: teacher.User.Email,
      image: teacher.User.ImageFilePath 
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error in searchUserByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLeadersByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }
    const courses = await Course.findAll({
      where: { TeacherId: teacherId },
      include: [
        {
          model: Group,
          as: 'Groups',
          required: false,
          include: [
            {
              model: Student,
              as: 'Students',
              through: { attributes: [] },
              required: false,
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
        },
      ],
    });

    // if (!courses.length) {
    //   console.log(`No courses found for teacher with ID: ${teacherId}`);
    //   return res.status(404).json({ message: 'No courses found for the teacher' });
    // }

    const leaders = [];
    for (const course of courses) {
      const groups = course.Groups || [];
      for (const group of groups) {
        const students = group.Students || [];
        for (const student of students) {
          if (!student.User) {
            console.warn(`No user found for student ${student.StudentId} in group ${group.GroupId}`);
            continue;
          }

          leaders.push({
            name: `${student.User.FirstName} ${student.User.LastName}`,
            group: group.GroupName,
            image: student.User.ImageFilePath,
            email: student.User.Email,
          });
        }
      }
    }

    const uniqueLeaders = Array.from(new Map(leaders.map(leader => [leader.email, leader])).values());

    res.status(200).json(uniqueLeaders);
  } catch (error) {
    console.error('Error in getLeadersByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLatestActivitiesByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const activities = await DoneHomeTask.findAll({
      include: [
        {
          model: HomeTask,
          as: 'HomeTask',
          required: true,
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
                  where: { TeacherId: teacherId },
                },
              ],
            },
          ],
        },
        {
          model: Student,
          as: 'Student',
          required: true,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['FirstName', 'LastName', 'ImageFilePath'],
              required: true,
            },
          ],
        },
      ],
      attributes: ['DoneDate'],
      order: [['DoneDate', 'DESC']],
      //limit: 10,
    });

    // if (!activities.length) {
    //   console.log(`No activities found for teacher with ID: ${teacherId}`);
    //   return res.status(404).json({ message: 'No activities found for the teacher' });
    // }

    const formattedActivities = activities.map(activity => {
      const student = activity.Student.User;
      const groupName = activity.HomeTask.Group.GroupName;

      return {
        date: moment(activity.DoneDate).format('DD.MM.YYYY'),
        name: `${student.FirstName} ${student.LastName}`,
        image: student.ImageFilePath,
        subject: groupName,
        type: 'Домашня робота',
      };
    });

    res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Error in getLatestActivitiesByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDaysByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const groups = await Group.findAll({
      include: [
        {
          model: Course,
          as: 'Course',
          required: true,
          where: { TeacherId: teacherId },
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

    // if (!groups.length) {
    //   console.log(`No groups found for teacher with ID: ${teacherId}`);
    //   return res.status(404).json({ message: 'No groups found for the teacher' });
    // }

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
    console.error('Error in getDaysByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const convertStandardTimeZoneToUTC = (timeZone) => {
  return timeZone || 'UTC';
};

exports.getEventsByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
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
              where: { TeacherId: teacherId },
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
          ],
        },
      ],
      attributes: ['LessonHeader', 'LessonDate', 'StartLessonTime'],
      where: {
        LessonDate: {
          [Op.gte]: new Date(),
        },
      },
      order: [['LessonDate', 'ASC']],
      //limit: 3,
    });

    // if (!events.length) {
    //   console.log(`No events found for teacher with ID: ${teacherId}`);
    //   return res.status(404).json({ message: 'No events found for the teacher' });
    // }

    const formattedEvents = events.map(event => {
      const lessonDate = moment(event.LessonDate).format('YYYY-MM-DD');

      return {
        title: event.LessonHeader,
        date: lessonDate,
        time: moment(event.StartLessonTime).format('HH:mm'),
        image: event.Group.Course.Teacher.User.ImageFilePath ,
        link: '/',
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error in getEventsByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMarksByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const marks = await MarkHistory.findAll({
      include: [
        {
          model: Course,
          as: 'Course',
          required: true,
          where: { TeacherId: teacherId },
          include: [
            {
              model: Group,
              as: 'Groups',
              required: true,
              attributes: ['GroupName'],
            },
          ],
        },
      ],
      attributes: ['Mark', 'MarkDate', 'MarkType'],
    });

    // if (!marks.length) {
    //   console.log(`No marks found for teacher with ID: ${teacherId}`);
    //   return res.status(404).json({ message: 'No marks found for the teacher' });
    // }

    const grades = marks.map(mark => ({
      group: mark.Course.Groups[0].GroupName,
      grade: mark.Mark,
      type: mark.MarkType.charAt(0).toUpperCase() + mark.MarkType.slice(1),
      date: mark.MarkDate ? mark.MarkDate.toISOString().split('T')[0] : null,
    }));

    res.status(200).json(grades);
  } catch (error) {
    console.error('Error in getMarksByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductivityByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    if (isNaN(teacherId) || teacherId <= 0) {
      return res.status(400).json({ error: 'Invalid teacher ID' });
    }

    const now = moment();

    // Define period boundaries
    const periods = {
      Day: {
        currentStart: now.clone().startOf('day').toISOString(),
        currentEnd: now.clone().endOf('day').toISOString(),
        prevStart: now.clone().subtract(1, 'day').startOf('day').toISOString(),
        prevEnd: now.clone().subtract(1, 'day').endOf('day').toISOString(),
      },
      Week: {
        currentStart: now.clone().startOf('week').toISOString(),
        currentEnd: now.clone().endOf('week').toISOString(),
        prevStart: now.clone().subtract(1, 'week').startOf('week').toISOString(),
        prevEnd: now.clone().subtract(1, 'week').endOf('week').toISOString(),
      },
      Month: {
        currentStart: now.clone().startOf('month').toISOString(),
        currentEnd: now.clone().endOf('month').toISOString(),
        prevStart: now.clone().subtract(1, 'month').startOf('month').toISOString(),
        prevEnd: now.clone().subtract(1, 'month').endOf('month').toISOString(),
      },
      ThreeMonth: {
        currentStart: now.clone().subtract(2, 'months').startOf('month').toISOString(),
        currentEnd: now.clone().endOf('month').toISOString(),
        prevStart: now.clone().subtract(5, 'months').startOf('month').toISOString(),
        prevEnd: now.clone().subtract(3, 'months').endOf('month').toISOString(),
      },
      HalfYear: {
        currentStart: now.clone().subtract(5, 'months').startOf('month').toISOString(),
        currentEnd: now.clone().endOf('month').toISOString(),
        prevStart: now.clone().subtract(11, 'months').startOf('month').toISOString(),
        prevEnd: now.clone().subtract(6, 'months').endOf('month').toISOString(),
      },
      Year: {
        currentStart: now.clone().startOf('year').toISOString(),
        currentEnd: now.clone().endOf('year').toISOString(),
        prevStart: now.clone().subtract(1, 'year').startOf('year').toISOString(),
        prevEnd: now.clone().subtract(1, 'year').endOf('year').toISOString(),
      },
      AllTime: {
        currentStart: moment('2000-01-01').toISOString(),
        currentEnd: now.clone().toISOString(),
        prevStart: null,
        prevEnd: null,
      },
    };

    // Calculate rating once for all periods
    const ratings = await StudentCourseRating.findAll({
      include: [
        {
          model: Course,
          as: 'Course',
          required: true,
          where: { TeacherId: teacherId },
        },
      ],
      attributes: ['Rating'],
    });

    const rating = ratings.length
      ? ratings.reduce((sum, r) => sum + parseFloat(r.Rating), 0) / ratings.length
      : 5;

    const productivityData = {};

    for (const [periodName, period] of Object.entries(periods)) {
      // Tasks Checked
      const tasksChecked = await DoneHomeTask.count({
        include: [
          {
            model: HomeTask,
            as: 'HomeTask',
            required: true,
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
                    where: { TeacherId: teacherId },
                  },
                ],
              },
            ],
          },
        ],
        where: { DoneDate: { [Op.between]: [period.currentStart, period.currentEnd] } },
      });

      const prevTasksChecked = period.prevStart
        ? await DoneHomeTask.count({
          include: [
            {
              model: HomeTask,
              as: 'HomeTask',
              required: true,
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
                      where: { TeacherId: teacherId },
                    },
                  ],
                },
              ],
            },
          ],
          where: { DoneDate: { [Op.between]: [period.prevStart, period.prevEnd] } },
        })
        : 0;

      // Lessons Conducted
      const lessonsConducted = await PlannedLesson.count({
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
                where: { TeacherId: teacherId },
              },
            ],
          },
        ],
        where: { LessonDate: { [Op.between]: [period.currentStart, period.currentEnd] } },
      });

      const prevLessonsConducted = period.prevStart
        ? await PlannedLesson.count({
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
                  where: { TeacherId: teacherId },
                },
              ],
            },
          ],
          where: { LessonDate: { [Op.between]: [period.prevStart, period.prevEnd] } },
        })
        : 0;

      // New Clients
      const newClients = await GroupStudent.count({
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
                where: { TeacherId: teacherId },
              },
            ],
          },
        ],
        where: { JoinDate: { [Op.between]: [period.currentStart, period.currentEnd] } },
      });

      const prevNewClients = period.prevStart
        ? await GroupStudent.count({
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
                  where: { TeacherId: teacherId },
                },
              ],
            },
          ],
          where: { JoinDate: { [Op.between]: [period.prevStart, period.prevEnd] } },
        })
        : 0;

      // Reviews Received
      const reviewsReceived = await UserReview.count({
        where: {
          UserIdFor: {
            [Op.in]: sequelize.literal(`(SELECT UserId FROM Teachers WHERE TeacherId = ${teacherId})`),
          },
          CreateDate: { [Op.between]: [period.currentStart, period.currentEnd] },
        },
      });

      const prevReviewsReceived = period.prevStart
        ? await UserReview.count({
          where: {
            UserIdFor: {
              [Op.in]: sequelize.literal(`(SELECT UserId FROM Teachers WHERE TeacherId = ${teacherId})`),
            },
            CreateDate: { [Op.between]: [period.prevStart, period.prevEnd] },
          },
        })
        : 0;

      productivityData[periodName] = {
        tasksChecked,
        prevTasksChecked,
        lessonsConducted,
        prevLessonsConducted,
        newClients,
        prevNewClients,
        reviewsReceived,
        prevReviewsReceived,
        rating: parseFloat(rating.toFixed(1)),
      };
    }

    res.status(200).json(productivityData);
  } catch (error) {
    console.error('Error in getProductivityByTeacherId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTeacherOctoCoins = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const octoCoins = await OctoCoins.findOne({ where: { TeacherId: teacherId } });
    if (!octoCoins) {
      return res.status(404).json({ message: 'OctoCoins not found for this teacher' });
    }
    await octoCoins.update({ Amount: req.body.Amount });
    res.status(200).json(octoCoins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTeacherOctoCoinsById = async (req, res) => {
  try {
    const octoCoins = await OctoCoins.findOne({
      where: { TeacherId: req.params.id },
    });
    if (!octoCoins) return res.status(404).json({ message: 'OctoCoins not found for this teacher' });
    res.status(200).json(octoCoins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const teachers = await Teacher.findAll({
      where: { UserId: userId },
      include: [{
        model: User,
        as: 'User',
        attributes: ['UserId', 'FirstName', 'LastName', 'Email', 'ImageFilePath', 'Username']
      }]
    });
    
    if (!teachers.length) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    console.error('Error in getTeacherByUserId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.checkIfTeacher =  (UserId) => {
  try {
    const teacher = Teacher.findOne({
      where: { UserId },
    });
    return !!teacher;
  } catch (error) {
    console.error('Error checking teacher status:', error);
    return false;
  }
};