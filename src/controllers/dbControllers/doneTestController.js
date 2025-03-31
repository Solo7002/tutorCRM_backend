const { DoneTest, Student, Test, Group, Course, Subject, TestQuestion, TestAnswer, SelectedAnswer, sequelize, Trophies } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

const adjustTrophiesBasedOnMark = async (studentId, oldMark, newMark, transaction = null) => {
  const trophyAwards = {
    8: 1,
    9: 2,
    10: 3,
    11: 4,
    12: 5,
  };

  const oldTrophies = trophyAwards[oldMark] || 0;
  const newTrophies = trophyAwards[newMark] || 0;
  const trophyDifference = newTrophies - oldTrophies;

  if (trophyDifference !== 0) {
    let trophies = await Trophies.findOne({ where: { StudentId: studentId }, transaction });
    if (!trophies) {
      trophies = await Trophies.create({ StudentId: studentId, Amount: 0 }, { transaction });
    }

    const newAmount = Math.max(0, trophies.Amount + trophyDifference);
    await trophies.update({ Amount: newAmount }, { transaction });

    if (trophyDifference > 0) {
      console.log(`Added ${trophyDifference} trophies to StudentId: ${studentId}. New total: ${newAmount}`);
    } else {
      console.log(`Removed ${-trophyDifference} trophies from StudentId: ${studentId}. New total: ${newAmount}`);
    }
    return newAmount;
  }
  return null;
};

exports.createDoneTest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Mark, StudentId } = req.body;

    if (Mark !== undefined && (Mark < -1 || Mark > 12)) {
      await t.rollback();
      return res.status(400).json({ error: 'Mark must be between -1 and 12' });
    }

    const doneTest = await DoneTest.create(req.body, { transaction: t });

    if (Mark !== undefined && Mark >= 8 && Mark <= 12) {
      const newTrophyAmount = await adjustTrophiesBasedOnMark(StudentId, 0, Mark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(201).json({
          doneTest,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(201).json(doneTest);
  } catch (error) {
    await t.rollback();
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
    const doneTest = await DoneTest.findByPk(req.params.id, {
      include: [
        {
          model: Test,
          as: 'Test',
          include: [
            {
              model: Group,
              as: 'Groups',
              include: [
                {
                  model: Course,
                  as: 'Course',
                  include: [
                    {
                      model: Subject,
                      as: 'Subject',
                    },
                  ],
                },
              ],
            },
            {
              model: TestQuestion,
              as: 'TestQuestions',
              include: [
                {
                  model: TestAnswer,
                  as: 'TestAnswers',
                },
              ],
            },
          ],
        },
        {
          model: SelectedAnswer,
          as: 'SelectedAnswers',
          include: [
            {
              model: TestAnswer,
              as: 'TestAnswer',
            },
          ],
        },
      ],
    });

    if (!doneTest) {
      return res.status(404).json({ error: "DoneTest not found" });
    }

    const subjectName = doneTest.Test.Groups.Course.Subject.SubjectName;
    const testName = doneTest.Test.TestName;
    const mark = doneTest.Mark;
    const maxMark = doneTest.Test.MaxMark;
    const questionsAmount = doneTest.Test.TestQuestions.length;
    const spentTime = doneTest.SpentTime;
    const attemptsTotal = doneTest.Test.AttemptsTotal;

    const correctAnswersAmount = doneTest.SelectedAnswers.filter(
      (sa) => sa.TestAnswer.IsRightAnswer
    ).length;

    const attemptsUsed = await DoneTest.count({
      where: {
        TestId: doneTest.TestId,
        StudentId: doneTest.StudentId,
      },
    });

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
  const t = await sequelize.transaction();
  try {
    const doneTest = await DoneTest.findByPk(req.params.id, { transaction: t });
    if (!doneTest) {
      await t.rollback();
      return res.status(404).json({ error: "DoneTest not found" });
    }

    const previousMark = doneTest.Mark || 0;
    await doneTest.update(req.body, { transaction: t });

    const newMark = req.body.Mark;
    if (newMark !== undefined && newMark !== previousMark && (newMark >= 8 || previousMark >= 8)) {
      const studentId = doneTest.StudentId;
      const newTrophyAmount = await adjustTrophiesBasedOnMark(studentId, previousMark, newMark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(200).json({
          doneTest,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(200).json(doneTest);
  } catch (error) {
    await t.rollback();
    console.error('Error in updateDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneTest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const doneTest = await DoneTest.findByPk(req.params.id, { transaction: t });
    if (!doneTest) {
      await t.rollback();
      return res.status(404).json({ error: "DoneTest not found" });
    }

    const previousMark = doneTest.Mark || 0;
    if (previousMark >= 8) {
      await adjustTrophiesBasedOnMark(doneTest.StudentId, previousMark, 0, t);
    }

    await doneTest.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    console.error('Error in deleteDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.setMarkForDoneTest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { mark } = req.body;
    const doneTestId = req.params.id;

    if (mark === undefined || typeof mark !== 'number') {
      await t.rollback();
      return res.status(400).json({ error: 'Mark is required and must be a number' });
    }
    if (mark < -1 || mark > 12) {
      await t.rollback();
      return res.status(400).json({ error: 'Mark must be between -1 and 12' });
    }

    const doneTest = await DoneTest.findByPk(doneTestId, { transaction: t });
    if (!doneTest) {
      await t.rollback();
      return res.status(404).json({ error: 'DoneTest not found' });
    }

    const previousMark = doneTest.Mark || 0;
    await doneTest.update({ Mark: mark }, { transaction: t });

    if (mark !== previousMark && (mark >= 8 || previousMark >= 8)) {
      const studentId = doneTest.StudentId;
      const newTrophyAmount = await adjustTrophiesBasedOnMark(studentId, previousMark, mark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(200).json({
          doneTest,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(200).json(doneTest);
  } catch (error) {
    await t.rollback();
    console.error('Error in setMarkForDoneTest:', error);
    res.status(400).json({ error: error.message });
  }
};