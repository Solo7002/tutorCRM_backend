const { DoneTest, Student, Test, Group, Course, Subject, TestQuestion, TestAnswer, SelectedAnswer } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.create(req.body);
    res.status(201).json(doneTest);
  } catch (error) {
    console.error('Error in createDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTests = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneTests = await DoneTest.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(doneTests);
  } catch (error) {
    console.error('Error in getDoneTests:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTestById = async (req, res) => {
  console.log("!!!!!!!!! getDoneTestById: ", req.params.id);
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });
    res.status(200).json(doneTest);
  } catch (error) {
    console.error('Error in getDoneTestById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneTestInfoById = async (req, res) => {
  try {
    // Fetch the DoneTest record with all necessary associations
    const doneTest = await DoneTest.findByPk(req.params.id, {
      include: [
        {
          model: Test,
          as: 'Test', // Assuming DoneTest belongs to Test as 'Test'
          include: [
            {
              model: Group,
              as: 'Groups', // Test belongs to Group as 'Groups' per associations.js
              include: [
                {
                  model: Course,
                  as: 'Course', // Group belongs to Course as 'Course' per associations.js
                  include: [
                    {
                      model: Subject,
                      as: 'Subject', // Course belongs to Subject as 'Subject'
                    },
                  ],
                },
              ],
            },
            {
              model: TestQuestion,
              as: 'TestQuestions', // Test has many TestQuestions as 'TestQuestions'
              include: [
                {
                  model: TestAnswer,
                  as: 'TestAnswers', // TestQuestion has many TestAnswers as 'TestAnswers'
                },
              ],
            },
          ],
        },
        {
          model: SelectedAnswer,
          as: 'SelectedAnswers', // DoneTest has many SelectedAnswers as 'SelectedAnswers'
          include: [
            {
              model: TestAnswer,
              as: 'TestAnswer', // SelectedAnswer belongs to TestAnswer as 'TestAnswer'
            },
          ],
        },
      ],
    });

    // Check if DoneTest exists
    if (!doneTest) {
      return res.status(404).json({ error: "DoneTest not found" });
    }

    // Extract basic fields from the fetched data
    const subjectName = doneTest.Test.Groups.Course.Subject.SubjectName;
    const testName = doneTest.Test.TestName;
    const mark = doneTest.Mark;
    const maxMark = doneTest.Test.MaxMark;
    const questionsAmount = doneTest.Test.TestQuestions.length;
    const spentTime = doneTest.SpentTime;
    const attemptsTotal = doneTest.Test.AttemptsTotal;

    // Calculate CorrectAnswersAmount
    const correctAnswersAmount = doneTest.SelectedAnswers.filter(
      (sa) => sa.TestAnswer.IsRightAnswer
    ).length;

    // Calculate AttemptsUsed
    const attemptsUsed = await DoneTest.count({
      where: {
        TestId: doneTest.TestId,
        StudentId: doneTest.StudentId,
      },
    });

    // Prepare the Questions array
    const selectedAnswerIds = new Set(
      doneTest.SelectedAnswers.map((sa) => sa.TestAnswerId)
    );
    const questions = doneTest.Test.TestQuestions.map((tq) => ({
      TestQuestionId: tq.TestQuestionId,
      TestQuestionHeader: tq.TestQuestionHeader,
      ImagePath: tq.ImagePath,
      Answers: tq.TestAnswers.map((ta) => ({
        AnswerText: ta.AnswerText,
        isRightAnswer: ta.IsRightAnswer,
        isSelectedAnswer: selectedAnswerIds.has(ta.TestAnswerId),
      })),
    }));

    // Construct the response object
    const response = {
      SubjectName: subjectName,
      TestName: testName,
      Mark: mark,
      MaxMark: maxMark,
      QuestionsAmount: questionsAmount,
      CorrectAnswersAmount: correctAnswersAmount,
      SpentTime: spentTime,
      AttemptsTotal: attemptsTotal,
      AttemptsUsed: attemptsUsed,
      Questions: questions,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getDoneTestInfoById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchDoneTests = async (req, res) => {
  try {
    const { mark, startDate, endDate, studentId, testId } = req.query;
    const whereConditions = {};

    if (mark) whereConditions.Mark = { [Op.eq]: mark };
    if (startDate && endDate) {
      whereConditions.DoneDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereConditions.DoneDate = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereConditions.DoneDate = { [Op.lte]: new Date(endDate) };
    }
    if (studentId) whereConditions.StudentId = studentId;
    if (testId) whereConditions.TestId = testId;

    const doneTests = await DoneTest.findAll({
      where: whereConditions,
      include: [
        { model: Student, as: 'Student', attributes: ['StudentId', 'FirstName', 'LastName'] },
        { model: Test, as: 'Test', attributes: ['TestId', 'TestName'] },
      ],
    });

    if (!doneTests.length) {
      return res.status(404).json({ success: false, message: 'No tests found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: doneTests });
  } catch (error) {
    console.error('Error in searchDoneTests:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });

    await doneTest.update(req.body);
    res.status(200).json(doneTest);
  } catch (error) {
    console.error('Error in updateDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneTest = async (req, res) => {
  try {
    const doneTest = await DoneTest.findByPk(req.params.id);
    if (!doneTest) return res.status(404).json({ error: "DoneTest not found" });

    await doneTest.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};