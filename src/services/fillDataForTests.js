const {sequelize, UserReview, Course, Subject, Group, GroupStudent, Test, TestQuestion, TestAnswer, SelectedAnswer, DoneTest, Location, Teacher, Student, HomeTask, HomeTaskFile, DoneHomeTask, DoneHomeTaskFile, User  } = require('../models/dbModels');
const { Op } = require('sequelize');

async function populateDatabase() {
    // Створення Subject
    const subject = await Subject.create({ SubjectName: 'Математика' });

    // Створення Course
    const course = await Course.create({
        CourseName: 'Основи математики',
        ImageFilePath: 'http://example.com/math_course.jpg',
        SubjectId: subject.SubjectId,
        LocationId: 1,
        TeacherId: 1
    });

    // Створення Group
    const group = await Group.create({
        GroupName: 'Група А',
        GroupPrice: 100.00,
        ImageFilePath: 'http://example.com/group_a.jpg',
        CourseId: course.CourseId
    });

    // Створення GroupStudent
    await GroupStudent.create({
        StudentId: 7,
        GroupId: group.GroupId
    });

    // Створення тестів
    const test1 = await Test.create({
        TestName: 'Тест 3: Арифметика2',
        TestDescription: 'Тест з арифметики для початківців',
        CreatedDate: new Date(),
        DeadlineDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        TimeLimit: 30,
        MaxMark: 12,
        AttemptsTotal: 20,
        GroupId: group.GroupId,
        ShowAnswers: false
    });

    const test2 = await Test.create({
        TestName: 'Тест 4: Геометрія2',
        TestDescription: 'Тест з геометрії для початківців',
        CreatedDate: new Date(),
        DeadlineDate: new Date(Date.now()),
        TimeLimit: 30,
        MaxMark: 12,
        AttemptsTotal: 9,
        GroupId: group.GroupId,
        ShowAnswers: false
    });

    // Дані для питань і відповідей першого тесту (Арифметика)
    const questionsTest1 = [
        {
            header: 'Яка сума 2 і 3?',
            description: 'Додайте два числа.',
            answers: [
                { text: '5', isRight: true },
                { text: '6', isRight: false },
                { text: '4', isRight: false }
            ]
        },
        {
            header: 'Який добуток 4 і 5?',
            description: 'Помножте два числа.',
            answers: [
                { text: '20', isRight: true },
                { text: '25', isRight: false },
                { text: '15', isRight: false }
            ]
        },
        {
            header: 'Що таке 10 мінус 7?',
            description: 'Відніміть 7 від 10.',
            answers: [
                { text: '3', isRight: true },
                { text: '2', isRight: false },
                { text: '4', isRight: false }
            ]
        },
        {
            header: 'Скільки буде 12 поділити на 3?',
            description: 'Поділіть 12 на 3.',
            answers: [
                { text: '4', isRight: true },
                { text: '3', isRight: false },
                { text: '6', isRight: false }
            ]
        },
        {
            header: 'Яке число є наступним після 9?',
            description: 'Назвіть число, що йде після 9.',
            answers: [
                { text: '10', isRight: true },
                { text: '11', isRight: false },
                { text: '8', isRight: false }
            ]
        }
    ];

    // Дані для питань і відповідей другого тесту (Геометрія)
    const questionsTest2 = [
        {
            header: 'Скільки сторін у трикутника?',
            description: 'Вкажіть кількість сторін.',
            answers: [
                { text: '3', isRight: true },
                { text: '4', isRight: false },
                { text: '5', isRight: false }
            ]
        },
        {
            header: 'Яка фігура має чотири сторони?',
            description: 'Назвіть фігуру з чотирма сторонами.',
            answers: [
                { text: 'Квадрат', isRight: true },
                { text: 'Трикутник', isRight: false },
                { text: 'Коло', isRight: false }
            ]
        },
        {
            header: 'Що таке периметр?',
            description: 'Дайте визначення периметру.',
            answers: [
                { text: 'Сума довжин сторін', isRight: true },
                { text: 'Площа фігури', isRight: false },
                { text: 'Довжина кола', isRight: false }
            ]
        },
        {
            header: 'Яка площа квадрата зі стороною 2?',
            description: 'Обчисліть площу.',
            answers: [
                { text: '4', isRight: true },
                { text: '2', isRight: false },
                { text: '8', isRight: false }
            ]
        },
        {
            header: 'Скільки градусів у прямому куті?',
            description: 'Вкажіть кількість градусів.',
            answers: [
                { text: '90', isRight: true },
                { text: '180', isRight: false },
                { text: '45', isRight: false }
            ]
        }
    ];

    // Створення питань і відповідей для test1
    for (const q of questionsTest1) {
        const question = await TestQuestion.create({
            TestQuestionHeader: q.header,
            TestQuestionDescription: q.description,
            TestId: test1.TestId
        });
        for (const a of q.answers) {
            await TestAnswer.create({
                AnswerText: a.text,
                IsRightAnswer: a.isRight,
                TestQuestionId: question.TestQuestionId
            });
        }
    }

    // Створення питань і відповідей для test2
    for (const q of questionsTest2) {
        const question = await TestQuestion.create({
            TestQuestionHeader: q.header,
            TestQuestionDescription: q.description,
            TestId: test2.TestId
        });
        for (const a of q.answers) {
            await TestAnswer.create({
                AnswerText: a.text,
                IsRightAnswer: a.isRight,
                TestQuestionId: question.TestQuestionId
            });
        }
    }
    /*
    // Створення виконаних тестів
    const doneTest1 = await DoneTest.create({
        Mark: 80,
        DoneDate: new Date(),
        SpentTime: '00:10:00',
        StudentId: 7,
        TestId: test1.TestId
    });

    const doneTest2 = await DoneTest.create({
        Mark: 100,
        DoneDate: new Date(),
        SpentTime: '00:15:00',
        StudentId: 7,
        TestId: test2.TestId
    });

    // Створення SelectedAnswers для doneTest1
    const questions1 = await TestQuestion.findAll({ where: { TestId: test1.TestId } });
    for (let i = 0; i < questions1.length; i++) {
        const question = questions1[i];
        let selectedAnswer;
        if (i < 4) { // Перші чотири питання: вибір правильної відповіді
            selectedAnswer = await TestAnswer.findOne({
                where: { TestQuestionId: question.TestQuestionId, IsRightAnswer: true }
            });
        } else { // Останнє питання: вибір неправильної відповіді
            selectedAnswer = await TestAnswer.findOne({
                where: { TestQuestionId: question.TestQuestionId, IsRightAnswer: false }
            });
        }
        await SelectedAnswer.create({
            TestQuestionId: question.TestQuestionId,
            DoneTestId: doneTest1.DoneTestId,
            TestAnswerId: selectedAnswer.TestAnswerId
        });
    }

    // Створення SelectedAnswers для doneTest2
    const questions2 = await TestQuestion.findAll({ where: { TestId: test2.TestId } });
    for (const question of questions2) {
        const selectedAnswer = await TestAnswer.findOne({
            where: { TestQuestionId: question.TestQuestionId, IsRightAnswer: true }
        });
        await SelectedAnswer.create({
            TestQuestionId: question.TestQuestionId,
            DoneTestId: doneTest2.DoneTestId,
            TestAnswerId: selectedAnswer.TestAnswerId
        });
    }*/
}

async function populateWithHometasks() {
  const transaction = await sequelize.transaction();

  try {
    const teacher = await Teacher.findByPk(1, { transaction });
    if (!teacher) {
      throw new Error('Учитель с teacherId=1 не найден');
    }

    const [englishSubject, slovakSubject] = await Promise.all([
      Subject.findOrCreate({
        where: { SubjectName: 'Английский' },
        defaults: { SubjectName: 'Английский' },
        transaction,
      }),
      Subject.findOrCreate({
        where: { SubjectName: 'Словацкий' },
        defaults: { SubjectName: 'Словацкий' },
        transaction,
      }),
    ]);

    const courses = await Course.bulkCreate([
      {
        CourseName: 'Основы английского',
        TeacherId: teacher.TeacherId,
        SubjectId: englishSubject[0].SubjectId,
        LocationId: 1
      },
      {
        CourseName: 'Основы словацкого',
        TeacherId: teacher.TeacherId,
        SubjectId: slovakSubject[0].SubjectId,
        LocationId: 1
      },
    ], { transaction });

    const groups = await Group.bulkCreate([
      { GroupName: 'AВ-246', GroupPrice: 0, CourseId: courses[0].CourseId },
      { GroupName: 'БД-896', GroupPrice: 0, CourseId: courses[0].CourseId },
      { GroupName: 'СЛ-112', GroupPrice: 0, CourseId: courses[1].CourseId },
      { GroupName: 'БВ-221', GroupPrice: 0, CourseId: courses[1].CourseId },
    ], { transaction });

    const existingStudents = await Student.findAll({
      where: { StudentId: { [Op.in]: [7, 9] } },
      include: [{ model: User, as: 'User' }],
      transaction,
    });

    const newUsers = await User.bulkCreate([
      { Username: 'student1', Password: 'password', LastName: 'Иванов', FirstName: 'Иван', Email: 'student1@example.com' },
      { Username: 'student2', Password: 'password', LastName: 'Петров', FirstName: 'Петр', Email: 'student2@example.com' },
      { Username: 'student3', Password: 'password', LastName: 'Сидоров', FirstName: 'Сидор', Email: 'student3@example.com' },
      { Username: 'student4', Password: 'password', LastName: 'Кузнецов', FirstName: 'Алексей', Email: 'student4@example.com' },
      { Username: 'student5', Password: 'password', LastName: 'Смирнов', FirstName: 'Дмитрий', Email: 'student5@example.com' },
    ], { transaction });

    const newStudents = await Student.bulkCreate(newUsers.map(user => ({
      UserId: user.UserId,
    })), { transaction });

    const allStudents = [...existingStudents, ...newStudents];

    const groupStudents = [
      { GroupId: groups[0].GroupId, StudentId: existingStudents[0].StudentId },
      { GroupId: groups[0].GroupId, StudentId: existingStudents[1].StudentId },
      { GroupId: groups[0].GroupId, StudentId: newStudents[0].StudentId },
      { GroupId: groups[0].GroupId, StudentId: newStudents[1].StudentId },
      { GroupId: groups[1].GroupId, StudentId: newStudents[2].StudentId },
      { GroupId: groups[1].GroupId, StudentId: newStudents[3].StudentId },
      { GroupId: groups[2].GroupId, StudentId: existingStudents[0].StudentId },
      { GroupId: groups[2].GroupId, StudentId: newStudents[0].StudentId },
      { GroupId: groups[2].GroupId, StudentId: newStudents[4].StudentId },
      { GroupId: groups[3].GroupId, StudentId: existingStudents[1].StudentId },
      { GroupId: groups[3].GroupId, StudentId: newStudents[1].StudentId },
      { GroupId: groups[3].GroupId, StudentId: newStudents[2].StudentId },
    ];

    await sequelize.models.GroupStudent.bulkCreate(groupStudents, { transaction });

    const today = new Date('2025-03-19');

    for (const group of groups) {
      const numHomeTasks = group.GroupName.includes('А') ? 3 : 4;
      for (let i = 1; i <= numHomeTasks; i++) {
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7 - i);
        const deadlineDate = new Date(startDate);
        deadlineDate.setDate(startDate.getDate() + 28);

        console.log("startDate: ", startDate.toDateString());
        console.log("DeadLine: ", deadlineDate.toDateString());
        console.log("\n------------------------\n");

        const homeTask = await HomeTask.create({
          HomeTaskHeader: `Домашнее задание ${i} для ${group.GroupName}`,
          HomeTaskDescription: `Внимательно проанализировать и сделать задание в тетради ${i}`,
          ImageFilePath: `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/task_cover2.jpg`,
          StartDate: startDate,
          DeadlineDate: deadlineDate,
          MaxMark: 100,
          GroupId: group.GroupId,
        }, { transaction });

        await HomeTaskFile.bulkCreate([
          { FilePath: `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/Примеры задание 1.docx`, FileName: `Примеры задание 1.docx`, HomeTaskId: homeTask.HomeTaskId },
          { FilePath: `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/Уравнения задание 2.pdf`, FileName: `Уравнения задание 2.pdf`, HomeTaskId: homeTask.HomeTaskId },
        ], { transaction });

        const groupStudents = await sequelize.models.GroupStudent.findAll({
          where: { GroupId: group.GroupId },
          transaction,
        });

        const numDoneTasks = Math.floor(Math.random() * groupStudents.length) + 1;
        const selectedStudents = groupStudents.slice(0, numDoneTasks);

        for (const gs of selectedStudents) {
          const student = await Student.findByPk(gs.StudentId, { transaction });
          const doneDate = new Date(startDate);
          doneDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7));

          const doneHomeTask = await DoneHomeTask.create({
            Mark: Math.floor(Math.random() * 13),
            DoneDate: doneDate,
            HomeTaskId: homeTask.HomeTaskId,
            StudentId: student.StudentId,
          }, { transaction });

          await DoneHomeTaskFile.bulkCreate([
            { FilePath: `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/done_ht.jpg`, FileName: `done_ht.jpg`, DoneHomeTaskId: doneHomeTask.DoneHomeTaskId },
            { FilePath: `https://blobstorage226122007.blob.core.windows.net/blob-storage-container/done_ht2.jpg`, FileName: `Уравнения done_ht2.jpg`, DoneHomeTaskId: doneHomeTask.DoneHomeTaskId },
          ], { transaction });
        }
      }
    }

    await transaction.commit();
    console.log('Тестовые данные успешно добавлены');
  } catch (error) {
    await transaction.rollback();
    console.error('Ошибка при добавлении тестовых данных:', error);
    throw error;
  }
}

async function populateWithReviews() {
  const reviews = [
    {
      ReviewHeader: 'Хороший репетитор',
      ReviewText: 'Репетитор добре пояснює матеріал і завжди готовий допомогти. Заняття були цікавими, але іноді бракувало практичних завдань.',
      Stars: 4,
      UserIdFrom: 44,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
    {
      ReviewHeader: 'Не рекомендую',
      ReviewText: 'Репетитор часто спізнювався на заняття і не готувався до уроків. Матеріал пояснював незрозуміло, і я не відчув прогресу у навчанні.',
      Stars: 1,
      UserIdFrom: 22,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
    {
      ReviewHeader: 'Середній рівень',
      ReviewText: 'Репетитор непоганий, але не вражає. Заняття проходили за планом, але бракувало індивідуального підходу.',
      Stars: 3,
      UserIdFrom: 43,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
    {
      ReviewHeader: 'Відмінний репетитор!',
      ReviewText: 'Репетитор чудово знає предмет і вміє його доступно пояснити. Заняття завжди були цікавими і продуктивними. Рекомендую!',
      Stars: 5,
      UserIdFrom: 45,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
    {
        ReviewHeader: 'Задовільно, але є недоліки',
        ReviewText: 'Репетитор знає предмет, але не вміє його доступно пояснити. Заняття були нудними, і я часто втрачав інтерес.',
        Stars: 2,
        UserIdFrom: 27,
        UserIdFor: 26,
        CreateDate: new Date(),
      },
    {
      ReviewHeader: 'Нормально',
      ReviewText: 'Репетитор виконував свою роботу, але не більше. Заняття були стандартними, без особливих інновацій.',
      Stars: 3,
      UserIdFrom: 46,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
    {
      ReviewHeader: 'Найкращий репетитор!',
      ReviewText: 'Репетитор не тільки знає предмет, а й вміє зацікавити учня. Заняття були динамічними, з великою кількістю практичних завдань. Дуже задоволений!',
      Stars: 5,
      UserIdFrom: 47,
      UserIdFor: 26,
      CreateDate: new Date(),
    },
  ];

  try {
    await UserReview.bulkCreate(reviews);
    console.log('Відгуки успішно додано до бази даних');
  } catch (error) {
    console.error('Помилка при додаванні відгуків:', error);
  }
}

module.exports = {populateDatabase, populateWithHometasks, populateWithReviews };