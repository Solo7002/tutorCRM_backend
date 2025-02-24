const { DoneHomeTask, HomeTask,Group, Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.create(req.body);
    res.status(201).json(doneHometask);
  } catch (error) {
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
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });

    await doneHometask.update(req.body);
    res.status(200).json(doneHometask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDoneHometask = async (req, res) => {
  try {
    const doneHometask = await DoneHomeTask.findByPk(req.params.id);
    if (!doneHometask) return res.status(404).json({ error: "DoneHometask not found" });

    await doneHometask.destroy();
    res.status(204).send();
  } catch (error) {
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
      Mark: { [Op.gte]:-1 }, // Оценка -1 значит дз еще на проверке 
      HomeTaskId:homeTaskId
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
