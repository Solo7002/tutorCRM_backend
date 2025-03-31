const { DoneHomeTask, HomeTask, Group, Student, Trophies, sequelize } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

// Функция для изменения трофеев на основе оценки
const adjustTrophiesBasedOnMark = async (studentId, oldMark, newMark, transaction = null) => {
  const trophyAwards = {
    8: 1,
    9: 2,
    10: 3,
    11: 4,
    12: 5,
  };

  const oldTrophies = trophyAwards[oldMark] || 0; // Трофеи за старую оценку
  const newTrophies = trophyAwards[newMark] || 0; // Трофеи за новую оценку
  const trophyDifference = newTrophies - oldTrophies; // Разница в трофеях

  if (trophyDifference !== 0) { // Если есть изменение в трофеях
    let trophies = await Trophies.findOne({ where: { StudentId: studentId }, transaction });
    if (!trophies) {
      trophies = await Trophies.create({ StudentId: studentId, Amount: 0 }, { transaction });
    }

    const newAmount = Math.max(0, trophies.Amount + trophyDifference); // Не допускаем отрицательное количество
    await trophies.update({ Amount: newAmount }, { transaction });

    if (trophyDifference > 0) {
      console.log(`Added ${trophyDifference} trophies to StudentId: ${studentId}. New total: ${newAmount}`);
    } else {
      console.log(`Removed ${-trophyDifference} trophies from StudentId: ${studentId}. New total: ${newAmount}`);
    }
    return newAmount;
  }
  return null; // Возвращаем null, если трофеи не изменились
};

exports.createDoneHometask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Mark, StudentId } = req.body;

    if (Mark !== undefined && (Mark < -1 || Mark > 12)) {
      await t.rollback();
      return res.status(400).json({ error: 'Mark must be between -1 and 12' });
    }

    const doneHometask = await DoneHomeTask.create(req.body, { transaction: t });

    if (Mark !== undefined && Mark >= 8 && Mark <= 12) {
      const newTrophyAmount = await adjustTrophiesBasedOnMark(StudentId, 0, Mark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(201).json({
          doneHometask,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(201).json(doneHometask);
  } catch (error) {
    await t.rollback();
    console.error('Error in createDoneHometask:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const doneHometasks = await DoneHomeTask.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(doneHometasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDoneHometaskById = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchDoneHomeTasks = async (req, res) => {
  try {
    const { mark, studentId, homeTaskId, doneDate } = req.query;
    let whereConditions = {};

    if (mark) whereConditions.Mark = { [Op.eq]: mark };
    if (studentId) whereConditions.StudentId = studentId;
    if (homeTaskId) whereConditions.HomeTaskId = homeTaskId;
    if (doneDate) whereConditions.DoneDate = { [Op.eq]: doneDate };

    const tasks = await DoneHomeTask.findAll({
      where: whereConditions,
      include: [
        { model: HomeTask, as: 'HomeTask', attributes: ['HomeTaskId', 'TaskName'] },
        { model: Student, as: 'Student', attributes: ['StudentId', 'FullName'] },
      ],
    });

    if (!tasks.length) {
      return res.status(404).json({ success: false, message: 'No tasks found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error in searchDoneHomeTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateDoneHometask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id, { transaction: t });
    if (!doneHometask) {
      await t.rollback();
      return res.status(404).json({ error: "DoneHometask not found" });
    }

    const previousMark = doneHometask.Mark || 0;
    await doneHometask.update(req.body, { transaction: t });

    const newMark = req.body.Mark;
    if (newMark !== undefined && newMark !== previousMark && (newMark >= 8 || previousMark >= 8)) {
      const studentId = doneHometask.StudentId;
      const newTrophyAmount = await adjustTrophiesBasedOnMark(studentId, previousMark, newMark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(200).json({
          doneHometask,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(200).json(doneHometask);
  } catch (error) {
    await t.rollback();
    console.error('Error in updateDoneHometask:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id, { transaction: t });
    if (!doneHometask) {
      await t.rollback();
      return res.status(404).json({ error: "DoneHometask not found" });
    }

    const previousMark = doneHometask.Mark || 0;
    if (previousMark >= 8) {
      await adjustTrophiesBasedOnMark(doneHometask.StudentId, previousMark, 0, t);
    }

    await doneHometask.destroy({ transaction: t });
    await t.commit();
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getPendingHomeTasksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Получаем все ДЗ, которые еще не проверены (оценка -1)
    const pendingTasks = await DoneHomeTask.findAll({
      where: {
        StudentId: studentId,
        Mark: -1, // ДЗ еще на проверке
      },
      include: [
        {
          model: HomeTask,
          as: 'HomeTask',
          include: [
            {
              model: Group,
              as: 'Group',
              attributes: ['GroupId', 'GroupName'],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: `Pending home tasks for student ID: ${studentId}`,
      data: pendingTasks,
    });
  } catch (error) {
    console.error('Error in getPendingHomeTasksByStudentId:', error);
    res.status(500).json({
      message: `Error in getPendingHomeTasksByStudentId: ${error.message}`,
    });
  }
};


exports.getCheckedHomeTasksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Получаем все ДЗ, которые уже проверены (оценка >= 0)
    const checkedTasks = await DoneHomeTask.findAll({
      where: {
        StudentId: studentId,
        Mark: { [Op.gte]: 0 }, // Оценка 0 или выше -> проверенное ДЗ
      },
      include: [
        {
          model: HomeTask,
          as: 'HomeTask',
          include: [
            {
              model: Group,
              as: 'Group',
              attributes: ['GroupId', 'GroupName'],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: `Checked home tasks for student ID: ${studentId}`,
      data: checkedTasks,
    });
  } catch (error) {
    console.error('Error in getCheckedHomeTasksByStudentId:', error);
    res.status(500).json({
      message: `Error in getCheckedHomeTasksByStudentId: ${error.message}`,
    });
  }
};

exports.getPedingHomeTasksByStudentIdAndHometaskId = async (req, res) => {
  try {
    const { studentId, homeTaskId } = req.params;

    // Валидация параметров
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'StudentId must be a number' });
    }

    if (homeTaskId && isNaN(homeTaskId)) {
      return res.status(400).json({ message: 'HomeTaskId must be a number' });
    }
    console.log(studentId, homeTaskId);
    // Условия для поиска
    const whereConditions = {
      StudentId: studentId,
      Mark: { [Op.gte]: -1 }, // Оценка -1 значит дз еще на проверке 
      HomeTaskId: homeTaskId
    };




    // Получаем все ДЗ, которые на проверке
    const checkedTasks = await DoneHomeTask.findAll({
      where: whereConditions,
      include: [
        {
          model: HomeTask,
          as: 'HomeTask',
          include: [
            {
              model: Group,
              as: 'Group',
              attributes: ['GroupId', 'GroupName'],
            },
          ],
        },
      ],
    });

    // Если данные не найдены
    if (checkedTasks.length === 0) {
      return res.status(404).json({
        message: 'No checked home tasks found for the given criteria',
      });
    }

    res.status(200).json({
      message: `Checked home tasks for student ID: ${studentId}`,
      data: checkedTasks,
    });
  } catch (error) {
    console.error('Error in getCheckedHomeTasksByStudentId:', error);
    res.status(500).json({
      message: `Error in getCheckedHomeTasksByStudentId: ${error.message}`,
    });
  }
};

exports.setMarkForDoneHometask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { mark } = req.body;
    const doneHometaskId = req.params.id;

    if (mark === undefined || typeof mark !== 'number') {
      await t.rollback();
      return res.status(400).json({ error: 'Mark is required and must be a number' });
    }
    if (mark < -1 || mark > 12) {
      await t.rollback();
      return res.status(400).json({ error: 'Mark must be between -1 and 12' });
    }

    const doneHometask = await DoneHomeTask.findByPk(doneHometaskId, { transaction: t });
    if (!doneHometask) {
      await t.rollback();
      return res.status(404).json({ error: 'DoneHomeTask not found' });
    }

    const previousMark = doneHometask.Mark || 0; // Предполагаем 0, если Mark был null
    await doneHometask.update({ Mark: mark }, { transaction: t });

    if (mark !== previousMark && (mark >= 8 || previousMark >= 8)) {
      const studentId = doneHometask.StudentId;
      const newTrophyAmount = await adjustTrophiesBasedOnMark(studentId, previousMark, mark, t);
      if (newTrophyAmount !== null) {
        await t.commit();
        return res.status(200).json({
          doneHometask,
          trophiesUpdated: true,
          newTrophyAmount,
        });
      }
    }

    await t.commit();
    res.status(200).json(doneHometask);
  } catch (error) {
    await t.rollback();
    console.error('Error in setMarkForDoneHometask:', error);
    res.status(400).json({ error: error.message });
  }
};