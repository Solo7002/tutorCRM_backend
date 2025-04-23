const bcrypt = require('bcrypt');
const { Sequelize, Op } = require('sequelize');
const { sequelize } = require('../models/dbModels');
const models = require('../models/dbModels');

async function populateDbForTeacher(user_id) {
    const userId = user_id;
    const transaction = await sequelize.transaction();

    try {
        const teacher = await models.Teacher.findOne({ where: { UserId: userId }, transaction });
        if (!teacher) {
            throw new Error('Вчителя не знайдено для заданого UserId');
        }

        // Location
        const location = await models.Location.create({
            City: 'Харків',
            Country: 'Україна',
            Latitude: 0,
            Longitude: 0,
            Address: 'вул. Прикладна, 1',
        }, { transaction });

        // Subject
        const subjects = await models.Subject.bulkCreate([
            { SubjectName: 'Математика НМТ' },
            { SubjectName: 'Основи Англійської' },
            { SubjectName: 'Квантова механіка' },
        ], { transaction });

        // Courses
        const courses = await models.Course.bulkCreate([
            { CourseName: 'Математика НМТ', LocationId: location.LocationId, SubjectId: subjects[0].SubjectId, TeacherId: teacher.TeacherId },
            { CourseName: 'Основи Англійської', LocationId: location.LocationId, SubjectId: subjects[1].SubjectId, TeacherId: teacher.TeacherId },
            { CourseName: 'Квантова механіка', LocationId: location.LocationId, SubjectId: subjects[2].SubjectId, TeacherId: teacher.TeacherId },
        ], { transaction });

        // Groups
        const groupData = {
            'Математика НМТ': ['МН-216', 'МН-356', 'МН-489'],
            'Основи Англійської': ['АВ-596', 'АВ-732', 'АВ-845'],
            'Квантова механіка': ['КМ-921', 'КМ-103'],
        };
        const groups = [];
        for (const course of courses) {
            const groupNames = groupData[course.CourseName];
            for (const name of groupNames) {
                const group = await models.Group.create({
                    GroupName: name,
                    GroupPrice: Math.floor(Math.random() * (500 - 250 + 1)) + 250,
                    CourseId: course.CourseId,
                }, { transaction });
                groups.push(group);
            }
        }

        const studentNames = [
            'Шевченко Олександр', 'Бондаренко Ірина', 'Коваль Максим', 'Мельник Катерина',
            'Савченко Андрій', 'Литвиненко Марія', 'Ткачук Дмитро', 'Поліщук Олена',
            'Сидоренко Артем', 'Дяченко Наталія', 'Хоменко Владислав', 'Гаврилюк Аліна',
            'Романенко Єгор', 'Остапчук Тетяна', 'Зінченко Ілля', 'Панченко Христина',
            'Міщенко Назар', 'Білан Софія', 'Клименко Ярослав', 'Яценко Вікторія',
            'Петренко Степан', 'Шульга Дарина', 'Гончар Юрій', 'Кравчук Анастасія', 'Мороз Владлена',
        ];

        const translitMap = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
            'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
            'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
            'ю': 'yu', 'я': 'ya'
        };

        function transliterate(text) {
            return text.toLowerCase().split('').map(char =>
                translitMap[char] !== undefined ? translitMap[char] : char
            ).join('');
        }

        const students = [];
        const hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(password, salt);
        };

        for (const name of studentNames) {
            const [lastName, firstName] = name.split(' ');

            const translitFirstName = transliterate(firstName);
            const translitLastName = transliterate(lastName);

            const username = `${translitFirstName}${translitLastName}`;
            const email = `${username.toLowerCase()}@example.com`;

            const password = await hashPassword('12345678');
            const user = await models.User.create({
                Username: username,
                Password: password,
                LastName: lastName,
                FirstName: firstName,
                Email: email,
                ImageFilePath: null,
            }, { transaction });

            const student = await models.Student.create({ UserId: user.UserId }, { transaction });
            students.push(student);
        }

        // GroupStudent
        const studentCourses = {};
        for (const student of students) {
            const numCourses = Math.floor(Math.random() * 2) + 1;
            const selectedCourses = courses.sort(() => 0.5 - Math.random()).slice(0, numCourses);
            studentCourses[student.StudentId] = selectedCourses.map(c => c.CourseId);
        }
        const groupStudents = [];
        const courseGroups = {};
        for (const group of groups) {
            courseGroups[group.CourseId] = courseGroups[group.CourseId] || [];
            courseGroups[group.CourseId].push(group);
        }
        for (const student of students) {
            const courseIds = studentCourses[student.StudentId];
            for (const courseId of courseIds) {
                const courseGroupsList = courseGroups[courseId];
                const randomGroup = courseGroupsList[Math.floor(Math.random() * courseGroupsList.length)];
                groupStudents.push({
                    StudentId: student.StudentId,
                    GroupId: randomGroup.GroupId,
                    JoinDate: new Date(),
                });
            }
        }
        await models.GroupStudent.bulkCreate(groupStudents, { transaction });

        // PlannedLessons
        const today = new Date();
        const startDate = new Date(today); startDate.setMonth(today.getMonth() - 1);
        const endDate = new Date(today); endDate.setMonth(today.getMonth() + 1);
        const slots = [
            { start: '09:00', end: '10:30' },
            { start: '11:00', end: '12:30' },
            { start: '14:00', end: '15:30' },
            { start: '16:00', end: '17:30' },
        ];
        const dayPairs = [[1, 3], [2, 4]];
        const assignedSlots = {};
        for (let i = 0; i < 4; i++) {
            assignedSlots[groups[i].GroupId] = { days: dayPairs[0], slot: slots[i] };
            assignedSlots[groups[i + 4].GroupId] = { days: dayPairs[1], slot: slots[i] };
        }
        function getDatesForDay(start, end, dayOfWeek) {
            const dates = [];
            let current = new Date(start);
            while (current <= end) {
                if (current.getDay() === dayOfWeek) dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            return dates;
        }
        const platforms = ['https://meet.google.com/landing', 'https://www.zoom.com', 'https://www.microsoft.com/uk-ua/microsoft-teams/log-in'];
        const plannedLessons = [];
        for (const group of groups) {
            const { days, slot } = assignedSlots[group.GroupId];
            for (const dayOfWeek of days) {
                const dates = getDatesForDay(startDate, endDate, dayOfWeek);
                for (const date of dates) {
                    const startTime = new Date(date);
                    const [startHour, startMinute] = slot.start.split(':').map(Number);
                    startTime.setHours(startHour, startMinute, 0, 0);
                    const endTime = new Date(date);
                    const [endHour, endMinute] = slot.end.split(':').map(Number);
                    endTime.setHours(endHour, endMinute, 0, 0);
                    plannedLessons.push({
                        LessonHeader: `Урок з ${group.GroupName}`,
                        StartLessonTime: startTime,
                        EndLessonTime: endTime,
                        LessonDate: date,
                        LessonType: 'online',
                        LessonLink: platforms[Math.floor(Math.random() * platforms.length)],
                        GroupId: group.GroupId,
                        TeacherId: teacher.TeacherId,
                    });
                }
            }
        }
        await models.PlannedLesson.bulkCreate(plannedLessons, { transaction });

        // MarkHistory + Trophies
        const oneYearAgo = new Date(today); oneYearAgo.setFullYear(today.getFullYear() - 1);
        const months = [];
        let currentMonth = new Date(oneYearAgo);
        while (currentMonth < today) {
            months.push(new Date(currentMonth));
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        function getRandomDateInMonth(monthDate) {
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const day = Math.floor(Math.random() * daysInMonth) + 1;
            return new Date(year, month, day);
        }

        const markTypes = ['test', 'homework', 'classwork'];
        const studentTrophies = {};
        for (const student of students) studentTrophies[student.StudentId] = 0;
        const markHistories = [];

        for (const student of students) {
            const courseIds = studentCourses[student.StudentId];

            for (const courseId of courseIds) {
                for (const month of months) {
                    for (const markType of markTypes) {
                        const numberOfMarks = Math.floor(Math.random() * 3) + 1;

                        for (let i = 0; i < numberOfMarks; i++) {
                            const markDate = getRandomDateInMonth(month);
                            const mark = Math.floor(Math.random() * 12) + 1;

                            markHistories.push({
                                Mark: mark,
                                MarkType: markType,
                                MarkDate: markDate,
                                StudentId: student.StudentId,
                                CourseId: courseId,
                            });

                            if (mark >= 8) studentTrophies[student.StudentId] += (mark - 7);
                        }
                    }
                }
            }
        }

        await models.MarkHistory.bulkCreate(markHistories, { transaction });

        const trophies = students.map(student => ({
            StudentId: student.StudentId,
            Amount: studentTrophies[student.StudentId],
        }));

        await models.Trophies.bulkCreate(trophies, { transaction });

        // HomeTasks
        const twoMonthsAgo = new Date(today); twoMonthsAgo.setMonth(today.getMonth() - 2);
        const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(today.getMonth() - 1);
        const oneMonthFromNow = new Date(today); oneMonthFromNow.setMonth(today.getMonth() + 1);
        const twoMonthsFromNow = new Date(today); twoMonthsFromNow.setMonth(today.getMonth() + 2);
        const coverImages = [
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_1.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_2.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_3.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_4.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_5.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_6.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_7.png',
        ];
        const htFiles = [
            { FilePath: 'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_1.jpg', FileName: 'ht_1.jpg' },
            { FilePath: 'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_2.jpg', FileName: 'ht_2.jpg' },
            { FilePath: 'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_3.jpg', FileName: 'ht_3.jpg' },
        ];
        const homeTasks = [];
        for (const group of groups) {
            const numTasks = Math.floor(Math.random() * 3) + 4; // 4-6
            for (let i = 0; i < numTasks; i++) {
                const startDate = new Date(twoMonthsAgo.getTime() + Math.random() * (oneMonthAgo.getTime() - twoMonthsAgo.getTime()));
                const deadlineDate = new Date(oneMonthFromNow.getTime() + Math.random() * (twoMonthsFromNow.getTime() - oneMonthFromNow.getTime()));
                homeTasks.push({
                    HomeTaskHeader: `Домашнє завдання ${i + 1} для групи ${group.GroupName}`,
                    HomeTaskDescription: `Опис домашнього завдання ${i + 1}`,
                    StartDate: startDate,
                    DeadlineDate: deadlineDate,
                    MaxMark: 12,
                    ImageFilePath: coverImages[Math.floor(Math.random() * coverImages.length)],
                    GroupId: group.GroupId,
                });
            }
        }
        const createdHomeTasks = await models.HomeTask.bulkCreate(homeTasks, { transaction });
        const homeTaskFiles = [];
        for (const homeTask of createdHomeTasks) {
            for (const file of htFiles) {
                homeTaskFiles.push({
                    FilePath: file.FilePath,
                    FileName: file.FileName,
                    HomeTaskId: homeTask.HomeTaskId,
                });
            }
        }
        await models.HomeTaskFile.bulkCreate(homeTaskFiles, { transaction });

        // DoneHomeTasks
        const groupStudentMap = {};
        for (const gs of groupStudents) {
            groupStudentMap[gs.GroupId] = groupStudentMap[gs.GroupId] || [];
            groupStudentMap[gs.GroupId].push(gs.StudentId);
        }
        const doneHtFiles = [
            { FilePath: 'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/done_ht2.jpg', FileName: 'done_ht2.jpg' },
        ];
        const doneHomeTasks = [];
        for (const homeTask of createdHomeTasks) {
            const studentIds = groupStudentMap[homeTask.GroupId] || [];
            if (studentIds.length === 0) {
                console.log(`No students found for GroupId ${homeTask.GroupId}, skipping DoneHomeTasks creation`);
                continue;
            }
            const numDone = Math.floor(studentIds.length * (0.5 + Math.random() * 0.3));
            const selectedStudents = studentIds.sort(() => 0.5 - Math.random()).slice(0, numDone);
            for (const studentId of selectedStudents) {
                const doneDate = new Date(homeTask.StartDate.getTime() + Math.random() * (today.getTime() - homeTask.StartDate.getTime()));
                const mark = Math.floor(Math.random() * 12) + 1;
                doneHomeTasks.push({
                    Mark: mark,
                    DoneDate: doneDate,
                    StudentId: studentId,
                    HomeTaskId: homeTask.HomeTaskId,
                });
            }
        }
        const createdDoneHomeTasks = await models.DoneHomeTask.bulkCreate(doneHomeTasks, { transaction });
        const doneHomeTaskFiles = [];
        for (const doneHomeTask of createdDoneHomeTasks) {
            for (const file of doneHtFiles) {
                doneHomeTaskFiles.push({
                    FilePath: file.FilePath,
                    FileName: file.FileName,
                    DoneHomeTaskId: doneHomeTask.DoneHomeTaskId,
                });
            }
        }
        await models.DoneHomeTaskFile.bulkCreate(doneHomeTaskFiles, { transaction });

        // Tests
        const tests = [];
        for (const group of groups) {
            const numTests = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < numTests; i++) {
                const createdDate = new Date(twoMonthsAgo.getTime() + Math.random() * (oneMonthAgo.getTime() - twoMonthsAgo.getTime()));
                const deadlineDate = new Date(oneMonthFromNow.getTime() + Math.random() * (twoMonthsFromNow.getTime() - oneMonthFromNow.getTime()));
                const timeLimit = Math.floor(Math.random() * 41) + 10;
                tests.push({
                    TestName: `Тест ${i + 1} для групи ${group.GroupName}`,
                    TestDescription: `Опис тесту ${i + 1}`,
                    CreatedDate: createdDate,
                    DeadlineDate: deadlineDate,
                    AttemptsTotal: 1,
                    MaxMark: 12,
                    ShowAnswers: false,
                    TimeLimit: timeLimit,
                    GroupId: group.GroupId,
                });
            }
        }
        const createdTests = await models.Test.bulkCreate(tests, { transaction });

        const questionsData = {
            'Математика НМТ': [
                {
                    header: 'Що таке похідна функції?', answers: [
                        { text: 'Зміна функції', isRight: false },
                        { text: 'Швидкість зміни функції', isRight: true },
                        { text: 'Площа під кривою', isRight: false },
                        { text: 'Інтеграл функції', isRight: false },
                    ]
                },
                {
                    header: 'Яке значення sin(90°)?', answers: [
                        { text: '0', isRight: false },
                        { text: '1', isRight: true },
                        { text: '-1', isRight: false },
                        { text: '∞', isRight: false },
                    ]
                },
                {
                    header: '2 + 2 = ?', answers: [
                        { text: '22', isRight: false },
                        { text: '4', isRight: true },
                        { text: '0', isRight: false },
                        { text: '5', isRight: false },
                    ]
                },
                {
                    header: 'Що таке логарифм?', answers: [
                        { text: 'Степінь', isRight: false },
                        { text: 'Обернена функція до експоненти', isRight: true },
                        { text: 'Додавання', isRight: false },
                        { text: 'Віднімання', isRight: false },
                    ]
                },
                {
                    header: 'Корінь з 16?', answers: [
                        { text: '8', isRight: false },
                        { text: '4', isRight: true },
                        { text: '2', isRight: false },
                        { text: '16', isRight: false },
                    ]
                },
            ],
            'Основи Англійської': [
                {
                    header: 'Як сказати "привіт" англійською?', answers: [
                        { text: 'Hello', isRight: true },
                        { text: 'Goodbye', isRight: false },
                        { text: 'Yes', isRight: false },
                        { text: 'No', isRight: false },
                    ]
                },
                {
                    header: 'Який артикль перед "apple"?', answers: [
                        { text: 'a', isRight: true },
                        { text: 'the', isRight: false },
                        { text: 'an', isRight: false },
                        { text: 'ніякий', isRight: false },
                    ]
                },
                {
                    header: 'Як буде "я є" англійською?', answers: [
                        { text: 'I am', isRight: true },
                        { text: 'I is', isRight: false },
                        { text: 'I are', isRight: false },
                        { text: 'I be', isRight: false },
                    ]
                },
                {
                    header: 'Переклад "book"?', answers: [
                        { text: 'Книга', isRight: true },
                        { text: 'Стіл', isRight: false },
                        { text: 'Ручка', isRight: false },
                        { text: 'Двері', isRight: false },
                    ]
                },
                {
                    header: 'День тижня?', answers: [
                        { text: 'Monday', isRight: true },
                        { text: 'Good', isRight: false },
                        { text: 'Cat', isRight: false },
                        { text: 'Run', isRight: false },
                    ]
                },
            ],
            'Квантова механіка': [
                {
                    header: 'Що таке квант?', answers: [
                        { text: 'Найменша частинка енергії', isRight: true },
                        { text: 'Велика маса', isRight: false },
                        { text: 'Швидкість', isRight: false },
                        { text: 'Температура', isRight: false },
                    ]
                },
                {
                    header: 'Хто розробив квантову теорію?', answers: [
                        { text: 'Ньютон', isRight: false },
                        { text: 'Планк', isRight: true },
                        { text: 'Ейнштейн', isRight: false },
                        { text: 'Галілей', isRight: false },
                    ]
                },
                {
                    header: 'Що таке хвильова функція?', answers: [
                        { text: 'Ймовірність знайти частинку', isRight: true },
                        { text: 'Швидкість частинки', isRight: false },
                        { text: 'Маса частинки', isRight: false },
                        { text: 'Енергія частинки', isRight: false },
                    ]
                },
                {
                    header: 'Принцип невизначеності належить?', answers: [
                        { text: 'Гейзенбергу', isRight: true },
                        { text: 'Бору', isRight: false },
                        { text: 'Діраку', isRight: false },
                        { text: 'Шредінгеру', isRight: false },
                    ]
                },
                {
                    header: 'Що таке фотон?', answers: [
                        { text: 'Квант світла', isRight: true },
                        { text: 'Електрон', isRight: false },
                        { text: 'Протон', isRight: false },
                        { text: 'Нейтрон', isRight: false },
                    ]
                },
            ],
        };

        const testQuestions = [];
        for (const test of createdTests) {
            const group = await models.Group.findByPk(test.GroupId, { transaction });
            const course = await group.getCourse({ transaction });
            const courseQuestions = questionsData[course.CourseName];
            for (const qData of courseQuestions) {
                testQuestions.push({
                    TestQuestionHeader: qData.header,
                    TestQuestionDescription: `Опис до ${qData.header}`,
                    TestId: test.TestId,
                });
            }
        }
        const createdTestQuestions = await models.TestQuestion.bulkCreate(testQuestions, { transaction });

        const testAnswers = [];
        let questionIndex = 0;
        for (const test of createdTests) {
            const group = await models.Group.findByPk(test.GroupId, { transaction });
            const course = await group.getCourse({ transaction });
            const courseQuestions = questionsData[course.CourseName];
            for (const qData of courseQuestions) {
                for (const answer of qData.answers) {
                    testAnswers.push({
                        AnswerText: answer.text,
                        IsRightAnswer: answer.isRight,
                        TestQuestionId: createdTestQuestions[questionIndex].TestQuestionId,
                    });
                }
                questionIndex++;
            }
        }
        await models.TestAnswer.bulkCreate(testAnswers, { transaction });

        const doneTests = [];
        const selectedAnswers = [];
        for (const test of createdTests) {
            const studentIds = groupStudentMap[test.GroupId];
            const numDone = Math.floor(studentIds.length * (0.5 + Math.random() * 0.3)); // 50-80%
            const selectedStudents = studentIds.sort(() => 0.5 - Math.random()).slice(0, numDone);
            for (const studentId of selectedStudents) {
                const doneDate = new Date(test.CreatedDate.getTime() + Math.random() * (today.getTime() - test.CreatedDate.getTime()));
                const spentMinutes = Math.floor(Math.random() * (test.TimeLimit - 3)) + 3;
                const spentTime = `00:${String(spentMinutes).padStart(2, '0')}:00`;
                const questions = await models.TestQuestion.findAll({ where: { TestId: test.TestId }, transaction });
                let correctCount = 0;
                for (const question of questions) {
                    const answers = await models.TestAnswer.findAll({ where: { TestQuestionId: question.TestQuestionId }, transaction });
                    const selectedAnswer = answers[Math.floor(Math.random() * answers.length)];
                    selectedAnswers.push({
                        TestQuestionId: question.TestQuestionId,
                        DoneTestId: null,
                        TestAnswerId: selectedAnswer.TestAnswerId,
                    });
                    if (selectedAnswer.IsRightAnswer) correctCount++;
                }
                const mark = Math.round((correctCount / questions.length) * 12);
                doneTests.push({
                    Mark: mark,
                    DoneDate: doneDate,
                    SpentTime: spentTime,
                    StudentId: studentId,
                    TestId: test.TestId,
                });
            }
        }
        const createdDoneTests = await models.DoneTest.bulkCreate(doneTests, { transaction });
        let saIndex = 0;
        for (const doneTest of createdDoneTests) {
            for (let i = 0; i < 5; i++) {
                selectedAnswers[saIndex].DoneTestId = doneTest.DoneTestId;
                saIndex++;
            }
        }
        await models.SelectedAnswer.bulkCreate(selectedAnswers, { transaction });

        // UserReviews
        const reviewTemplates = [
            { text: 'Дуже хороший викладач, пояснює матеріал доступно.', minStars: 4 },
            { text: 'Уроки цікаві, але іноді бракує практики.', minStars: 3 },
            { text: 'Викладач строгий, пояснення складні.', minStars: 1 },
            { text: 'Допомагає розібратися, але темп занадто швидкий.', minStars: 2 },
            { text: 'Чудовий учитель, уроки на високому рівні!', minStars: 5 },
        ];
        const studentUsers = await models.User.findAll({ where: { UserId: students.map(s => s.UserId) }, transaction });
        const userMap = studentUsers.reduce((map, user) => { map[user.UserId] = user; return map; }, {});
        const userReviews = [];
        for (const student of students) {
            const user = userMap[student.UserId];
            const review = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
            const stars = Math.max(review.minStars, Math.floor(Math.random() * 5) + 1);
            const createDate = new Date(twoMonthsAgo.getTime() + Math.random() * (today.getTime() - twoMonthsAgo.getTime()));
            userReviews.push({
                ReviewHeader: `Відгук від ${user.FirstName} ${user.LastName}`,
                ReviewText: review.text,
                CreateDate: createDate,
                UserIdFrom: user.UserId,
                UserIdFor: teacher.UserId,
                Stars: stars,
            });
        }
        await models.UserReview.bulkCreate(userReviews, { transaction });

        // Materials
        const folders = await models.Material.bulkCreate([
            { MaterialName: 'Папка 1', Type: 'folder', FilePath: null, TeacherId: teacher.TeacherId },
            { MaterialName: 'Папка 2', Type: 'folder', FilePath: null, TeacherId: teacher.TeacherId },
            { MaterialName: 'Папка 3', Type: 'folder', FilePath: null, TeacherId: teacher.TeacherId },
        ], { transaction });
        const files = [
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_1.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_2.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_3.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_4.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_5.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_6.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_7.png',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_1.jpg',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_2.jpg',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/ht_3.jpg',
            'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/done_ht2.jpg',
        ];
        const materialFiles = files.map(file => ({
            MaterialName: file.split('/').pop(),
            Type: 'file',
            FilePath: file,
            TeacherId: teacher.TeacherId,
            ParentId: null,
        }));
        await models.Material.bulkCreate(materialFiles, { transaction });
        for (const folder of folders) {
            for (let i = 0; i < 2; i++) {
                const file = files[Math.floor(Math.random() * files.length)];
                await models.Material.create({
                    MaterialName: `Файл ${i + 1} в ${folder.MaterialName}`,
                    Type: 'file',
                    FilePath: file,
                    TeacherId: teacher.TeacherId,
                    ParentId: folder.MaterialId,
                }, { transaction });
            }
        }

        await transaction.commit();
        console.log('База даних успішно заповнена!');
    } catch (error) {
        await transaction.rollback();
        console.error('Помилка при заповненні бази даних:', error);
        throw error;
    }
}

module.exports = populateDbForTeacher;