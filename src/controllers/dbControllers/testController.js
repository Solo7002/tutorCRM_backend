const { Student, GroupStudent, Test, DoneTest, Group, Course, Subject, Teacher, User, TestQuestion } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    console.error('Error in createTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTests = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const tests = await Test.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(tests);
  } catch (error) {
    console.error('Error in getTests:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.status(200).json(test);
  } catch (error) {
    console.error('Error in getTestById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchTests = async (req, res) => {
  try {
    const { testName, testDescription, startDate, endDate } = req.query;
    const whereConditions = {};

    if (testName) whereConditions.TestName = { [Op.like]: `%${testName}%` };
    if (testDescription) whereConditions.TestDescription = { [Op.like]: `%${testDescription}%` };

    if (startDate && endDate) {
      whereConditions.CreatedDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.CreatedDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.CreatedDate = { [Op.lte]: new Date(endDate) };
    }

    const tests = await Test.findAll({
      where: whereConditions,
      attributes: ['TestId', 'TestName', 'TestDescription', 'CreatedDate'],
    });

    if (!tests.length) {
      return res.status(404).json({ success: false, message: 'No tests found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: tests });
  } catch (error) {
    console.error('Error in searchTests:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    await test.update(req.body);
    res.status(200).json(test);
  } catch (error) {
    console.error('Error in updateTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    await test.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestInfo = async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id, {
      include: [
        {
          model: Group,
          as: 'Groups',
          include: {
            model: Course,
            as: 'Course',
            include: [
              { model: Subject, as: 'Subject' },
              {
                model: Teacher,
                as: 'Teacher',
                include: { model: User, as: 'User' }
              },
            ],
          },
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const questionCount = await TestQuestion.count({
      where: { TestId: test.TestId },
    });

    const response = {
      SubjectName: test.Groups.Course.Subject.SubjectName,
      UserLastname: test.Groups.Course.Teacher.User.LastName,
      UserFirstname: test.Groups.Course.Teacher.User.FirstName,
      AmountOfQuestions: questionCount,
      TestName: test.TestName,
      CreatedDate: test.CreatedDate,
      Deadline: test.DeadlineDate,
      MaxMark: test.MaxMark,
      Attempts: test.AttemptsTotal,
      TimeLimit: test.TimeLimit,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getTestInfo:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTestsByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Group,
          as: 'Groups',
          include: [
            {
              model: Test,
              as: 'Tests',
              include: [
                {
                  model: Group,
                  as: 'Groups',
                  include: [
                    {
                      model: Course,
                      as: 'Course',
                      include: [
                        { model: Subject, as: 'Subject' },
                        {
                          model: Teacher,
                          as: 'Teacher',
                          include: { model: User, as: 'User' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const tests = student.Groups.flatMap(group => group.Tests || []);

    const testInfoPromises = tests.map(async (test) => {
      const questionCount = await TestQuestion.count({
        where: { TestId: test.TestId },
      });

      const doneTests = await DoneTest.findAll({
        where: {
          StudentId: studentId,
          TestId: test.TestId,
        },
      });

      const doneTestId = doneTests.length > 0 
      ? doneTests.reduce((max, current) => max.Mark > current.Mark ? max : current).DoneTestId 
      : null;
      const isDone = doneTests.length > 0;
      const mark = isDone ? Math.max(...doneTests.map(dt => dt.Mark)) : null;
      const doneDate = isDone
        ? Math.min(...doneTests.map(dt => new Date(dt.DoneDate).getTime()))
        : null;
      const attemptsUsed = doneTests.length;

      return {
        TestId: test.TestId,
        SubjectName: test.Groups.Course.Subject.SubjectName,
        UserLastname: test.Groups.Course.Teacher.User.LastName,
        UserFirstname: test.Groups.Course.Teacher.User.FirstName,
        AmountOfQuestions: questionCount,
        TestName: test.TestName,
        CreatedDate: test.CreatedDate,
        Deadline: test.DeadlineDate,
        MaxMark: test.MaxMark,
        Attempts: test.AttemptsTotal,
        TimeLimit: test.TimeLimit,
        isDone,
        Mark: mark,
        DoneDate: doneDate ? new Date(doneDate).toISOString() : null,
        AttemptsUsed: attemptsUsed,
        DoneTestId: doneTestId,
      };
    });

    const testInfo = await Promise.all(testInfoPromises);

    res.status(200).json(testInfo);
  } catch (error) {
    console.error('Error in getTestsByStudentId:', error);
    res.status(400).json({ error: error.message });
  }
};