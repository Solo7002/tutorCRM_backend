const { Group, Student, Course, Subject, User, GroupStudent, MarkHistory, PlannedLesson, Teacher, HomeTask, Trophies, StudentCourseRating, UserPhone, sequelize } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const { convertStandardTimeZoneToUTC } = require('../../utils/dbUtils/timeUtils');


exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    const trophy = await Trophies.create({
      StudentId: student.StudentId,
      Amount: 0,
    });
    await student.update({ TrophyId: trophy.TrophyId });
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

exports.searchStudentsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const students = await Student.findAll({
      where: {
        UserId: userId
      }
    });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: 'No students found with this UserId.'
      });
    }

    return res.status(200).json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Error in searchStudentsByUserId:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
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
          image: student.User.ImageFilePath,
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

    // if (!marks.length) {
    //   console.log(`No marks found for student with ID: ${studentId}`);
    //   return res.status(404).json({ message: 'No marks found for the student' });
    // }

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
      attributes: ['LessonHeader', 'LessonDate', 'StartLessonTime'],
    });

    if (!events.length) {
      console.log(`No events found for student with ID: ${studentId}`);
      return res.status(404).json({ message: 'No events found for the student' });
    }

    const formattedEvents = events.map(event => {
      const lessonDate = moment(event.LessonDate).format('YYYY-MM-DD');

      // timezone conversion
      // const lessonDate = moment(event.LessonDate).tz(event.Group.Course.TimeZone || 'UTC').format('YYYY-MM-DD');

      return {
        title: event.Group.Course.Subject.SubjectName,
        date: lessonDate,
        time: moment(event.StartLessonTime).format('HH:mm'),
        image: event.Group.Course.Teacher.User.ImageFilePath,
        link: '/',
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

exports.searchTeachersForStudent = async (req, res) => {
  try {
    const {
      lessonType,
      meetingType,
      aboutTeacher,
      priceMin,
      priceMax,
      rating,
      format,
      priceSort,
      page = 1,
      limit = 12
    } = req.query;

    let whereConditions = {};
    let orderConditions = [];

    // Фильтрация по типу урока
    if (lessonType) whereConditions.LessonType = lessonType;

    // Фильтрация по формату встречи (поддержка обоих параметров)
    if (format) whereConditions.MeetingType = format;
    if (meetingType) whereConditions.MeetingType = meetingType;

    // Поиск по имени и описанию
    if (aboutTeacher) {
      whereConditions = {
        [Op.or]: [
          { AboutTeacher: { [Op.like]: `%${aboutTeacher}%` } },
          { '$User.FirstName$': { [Op.like]: `%${aboutTeacher}%` } },
          { '$User.LastName$': { [Op.like]: `%${aboutTeacher}%` } }
        ]
      };
    }

    // Фильтрация по цене
    if (priceMin || priceMax) {
      whereConditions.LessonPrice = {};

      if (priceMin) {
        whereConditions.LessonPrice[Op.gte] = priceMin;
      }

      if (priceMax) {
        whereConditions.LessonPrice = {
          [Op.or]: [
            { [Op.lte]: priceMax },
            { [Op.eq]: 0 }
          ]
        };
      }
    }

    // Сортировка по цене или рейтингу
    if (priceSort) {
      orderConditions.push(['LessonPrice', priceSort === 'desc' ? 'DESC' : 'ASC']);
    } else if (rating) {
      orderConditions.push([sequelize.literal('averageRating'), rating === 'desc' ? 'DESC' : 'ASC']);
    }

    // Получаем общее количество учителей для пагинации
    const totalCount = await Teacher.count({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['FirstName', 'LastName', 'ImageFilePath'],
          required: aboutTeacher ? true : false
        }
      ]
    });

    // Получаем учителей с пагинацией
    const teachers = await Teacher.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['FirstName', 'LastName', 'ImageFilePath'],
          required: aboutTeacher ? true : false
        },
        {
          model: Course,
          as: 'Courses',
          required: false,
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['SubjectName'],
            }
          ],
        },
      ],
      attributes: [
        'TeacherId',
        'AboutTeacher',
        'LessonPrice',
        [
          sequelize.literal(`(
            SELECT COALESCE(AVG(Rating), 5)
            FROM StudentsCourseRating 
            WHERE CourseId IN (
              SELECT CourseId 
              FROM Courses 
              WHERE TeacherId = Teacher.TeacherId
            )
          )`),
          'averageRating'
        ]
      ],
      order: orderConditions.length > 0 ? orderConditions : [[sequelize.literal('averageRating'), 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    const formattedTeachers = teachers.map((teacher) => ({
      TeacherId: teacher.TeacherId,
      FullName: `${teacher.User.FirstName} ${teacher.User.LastName}`,
      ImagePathUrl: teacher.User.ImageFilePath || null,
      SubjectName: teacher.Courses?.length > 0
        ? teacher.Courses.slice(0, 2)
          .map((course) => course.Subject?.SubjectName)
          .filter(Boolean)
          .join(', ')
        : 'Не вказано',
      AboutTeacher: teacher.AboutTeacher || 'Без опису',
      LessonPrice: teacher.LessonPrice || 0,
      Rating: Number(teacher.getDataValue('averageRating')).toFixed(1),
    }));

    return res.status(200).json({
      success: true,
      data: formattedTeachers,
      total: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      hasMore: parseInt(page) * parseInt(limit) < totalCount
    });
  } catch (error) {
    console.error('Error in searchTeachersForStudent:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.searchUserByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (isNaN(studentId) || studentId <= 0) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'FirstName', 'LastName', 'Email', 'ImageFilePath', 'Username'],
          required: true
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.User) {
      return res.status(404).json({ message: 'User not found for this student' });
    }

    const userData = {
      userId: student.User.UserId,
      username: student.User.Username,
      firstName: student.User.FirstName,
      lastName: student.User.LastName,
      email: student.User.Email,
      image: student.User.ImageFilePath
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error in searchUserByStudentId:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateStudentTrophiesById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const trophies = await Trophies.findOne({ where: { StudentId: studentId } });
    if (!trophies) {
      return res.status(404).json({ message: 'Trophies not found for this student' });
    }
    await trophies.update({ Amount: req.body.Amount });
    res.status(200).json(trophies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentTrophiesById = async (req, res) => {
  try {
    const trophies = await Trophies.findOne({
      where: { StudentId: req.params.id },
    });
    if (!trophies) return res.status(404).json({ message: 'Trophies not found for this student' });
    res.status(200).json(trophies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const students = await Student.findAll({
      where: { UserId: userId },
      include: [{
        model: User,
        as: 'User'
      }]
    });

    if (!students.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error in getStudentByUserId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllAboutStudent = async (req, res) => {
  try {
    // Get the ID from the route parameter
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // First find the student by UserId
    const student = await Student.findOne({
      where: { UserId: userId }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get user data and phone
    const user = await User.findByPk(userId, {
      attributes: ['UserId', 'FirstName', 'LastName', 'Email', 'ImageFilePath'],
      include: [{
        model: UserPhone,
        as: 'UserPhones',
        attributes: ['PhoneNumber'],
        required: false
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get student's groups
    const groups = await Group.findAll({
      include: [
        {
          model: Student,
          as: 'Students',
          where: { StudentId: student.StudentId },
          attributes: []
        },
        {
          model: Course,
          as: 'Course',
          attributes: ['CourseName'],
          include: [
            {
              model: Teacher,
              as: 'Teacher',
              attributes: ['TeacherId', 'LessonType', 'MeetingType'],
              include: [{
                model: User,
                as: 'User',
                attributes: ['FirstName', 'LastName']
              }]
            }
          ]
        }
      ],
      attributes: ['GroupId', 'GroupName', 'GroupPrice']
    });

    // Get student's trophies
    const trophies = await Trophies.findOne({
      where: { StudentId: student.StudentId },
      attributes: ['Amount']
    });

    // Get student's ranking based on trophies
    const studentTrophies = trophies?.Amount || 0;

    // Count students with more trophies to determine ranking
    const higherRankedStudents = await Student.count({
      include: [{
        model: Trophies,
        as: 'Trophies',
        where: {
          Amount: {
            [Op.gt]: studentTrophies
          }
        }
      }]
    });

    // Student's rank is the number of students with more trophies + 1
    const studentRank = higherRankedStudents + 1;

    // Get total number of students for percentage calculation
    const totalStudents = await Student.count();

    // Calculate percentile (lower is better)
    const percentile = totalStudents > 0 ? Math.round((studentRank / totalStudents) * 100) : 0;

    // Format the response
    const profile = {
      user: {
        UserId: user.UserId,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        ImageFilePath: user.ImageFilePath,
        PhoneNumber: user.UserPhones && user.UserPhones.length > 0 ? user.UserPhones[0].PhoneNumber : null
      },
      student: {
        StudentId: student.StudentId,
        SchoolName: student.SchoolName,
        Grade: student.Grade,
        CourseCount: groups.length,
        Rating: studentRank,
        Balance: studentTrophies,
        Percentile: percentile
      },
      groups: groups.map(group => ({
        GroupId: group.GroupId,
        GroupName: group.GroupName,
        GroupPrice: group.GroupPrice,
        GroupFormat: group.Course?.Teacher?.MeetingType || 'Не вказано',
        GroupType: group.Course?.Teacher?.LessonType || 'Не вказано',
        GroupTeacherName: group.Course?.Teacher?.User ?
          `${group.Course.Teacher.User.FirstName} ${group.Course.Teacher.User.LastName}` :
          'Не вказано',
        CourseName: group.Course?.CourseName || 'Не вказано'
      }))
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateStudentProfileByUserId = async (req, res) => {
  try {
    const { user: userData, student: studentData, phone: phoneData } = req.body;
    const userId = req.params.userId;

    // Start transaction
    const result = await sequelize.transaction(async (t) => {
      // Update user data
      if (userData) {
        await User.update(userData, {
          where: { UserId: userId },
          transaction: t
        });
      }

      // Update student data
      if (studentData) {
        await Student.update(studentData, {
          where: { UserId: userId },
          transaction: t
        });
      }

      // Update or create phone
      if (phoneData) {
        const [userPhone] = await UserPhone.findOrCreate({
          where: { UserId: userId },
          defaults: {
            ...phoneData,
            UserId: userId
          },
          transaction: t
        });

        if (userPhone) {
          await userPhone.update(phoneData, { transaction: t });
        }
      }

      // Get updated data
      const updatedStudent = await Student.findOne({
        where: { UserId: userId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['FirstName', 'LastName', 'Email', 'ImageFilePath'],
            include: [{
              model: UserPhone,
              as: 'UserPhones',
              attributes: ['PhoneNumber']
            }]
          }
        ],
        transaction: t
      });

      if (!updatedStudent) {
        throw new Error('Student not found');
      }

      return updatedStudent;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateStudentProfileByUserId:', error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getStudentGroups = async (req, res) => {
  try {
      const studentId = req.params.id;
      if (!studentId) {
          return res.status(400).json({ error: 'StudentId is required' });
      }

      const groupStudents = await GroupStudent.findAll({
          where: { StudentId: studentId },
          include: [
              {
                  model: Group,
                  as: 'Group',
                  include: [
                      {
                          model: Course,
                          as: 'Course',
                      },
                  ],
              },
          ],
      });

      const groups = groupStudents.map(gs => ({
          GroupId: gs.Group.GroupId,
          GroupName: gs.Group.GroupName,
          CourseId: gs.Group.CourseId,
          CourseName: gs.Group.Course.CourseName,
      }));

      res.status(200).json({ groups });
  } catch (err) {
      console.error('Error fetching student groups:', err);
      res.status(500).json({ error: 'Server error while fetching student groups' });
  }
};