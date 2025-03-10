const { Course, Subject, Group, GroupStudent, Test, TestQuestion, TestAnswer, SelectedAnswer, DoneTest, Location  } = require('../models/dbModels');

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

module.exports = {populateDatabase};