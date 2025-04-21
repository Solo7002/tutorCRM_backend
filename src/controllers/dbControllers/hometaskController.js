const { Teacher, Course, Group,GroupStudent, HomeTask, HomeTaskFile, DoneHomeTask, DoneHomeTaskFile, Student, User, Subject } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Sequelize, Op } = require('sequelize');

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
const mime = require('mime-types');


const openai = new OpenAI({
  apiKey: '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',
});

exports.createHomeTask = async (req, res) => {
  try {
    const { files, ...homeTaskData } = req.body;
    console.log(homeTaskData);

    const homeTask = await HomeTask.create(homeTaskData);

    if (files && files.length > 0) {
      const homeTaskFiles = files.map(file => ({
        HomeTaskId: homeTask.HomeTaskId,
        FilePath: file.FilePath,
        FileName: file.FileName
      }));
      await HomeTaskFile.bulkCreate(homeTaskFiles);
    }

    res.status(200).json(homeTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.getHomeTasks = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const homeTasks = await HomeTask.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(homeTasks);
  } catch (error) {
    console.error('Error in getHomeTasks:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getHomeTaskById = async (req, res) => {
  try {
    const homeTask = await HomeTask.findByPk(req.params.id);
    if (!homeTask) return res.status(404).json({ error: "HomeTask not found" });
    res.status(200).json(homeTask);
  } catch (error) {
    console.error('Error in getHomeTaskById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchHomeTasks = async (req, res) => {
  try {
    const { homeTaskHeader, groupId, startDate, deadlineDate } = req.query;
    const whereConditions = {};

    if (homeTaskHeader) whereConditions.HomeTaskHeader = { [Op.like]: `%${homeTaskHeader}%` };
    if (groupId) whereConditions.GroupId = groupId;

    if (startDate && deadlineDate) {
      whereConditions.StartDate = { [Op.between]: [new Date(startDate), new Date(deadlineDate)] };
    } else if (startDate) {
      whereConditions.StartDate = { [Op.gte]: new Date(startDate) };
    } else if (deadlineDate) {
      whereConditions.DeadlineDate = { [Op.lte]: new Date(deadlineDate) };
    }

    const homeTasks = await HomeTask.findAll({
      where: whereConditions,
      include: {
        model: Group,
        as: 'Group',
        attributes: ['GroupId', 'GroupName'],
      },
    });

    if (!homeTasks.length) {
      return res.status(404).json({ success: false, message: 'No home tasks found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: homeTasks });
  } catch (error) {
    console.error('Error in searchHomeTasks:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateHomeTask = async (req, res) => {
  try {
    const { newFiles, ...homeTaskData } = req.body;
    const homeTaskId = req.params.id;

    const homeTask = await HomeTask.findByPk(homeTaskId);
    if (!homeTask) {
      return res.status(404).json({ error: "HomeTask not found" });
    }

    await homeTask.update(homeTaskData);

    if (newFiles && newFiles.length > 0) {
      const homeTaskFiles = newFiles.map(file => ({
        HomeTaskId: homeTaskId,
        FilePath: file.FilePath,
        FileName: file.FileName,
      }));
      await HomeTaskFile.bulkCreate(homeTaskFiles);
    }

    res.status(200).json(homeTask);
  } catch (error) {
    console.error('Error in updateHomeTask:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHomeTask = async (req, res) => {
  try {
    const homeTask = await HomeTask.findByPk(req.params.id);
    if (!homeTask) return res.status(404).json({ error: "HomeTask not found" });

    await homeTask.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteHomeTask:', error);
    res.status(400).json({ error: error.message });
  }
};


exports.getNewHomeTasksByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

  
    const studentGroups = await GroupStudent.findAll({
      attributes: ['GroupId'],
      where: { StudentId: studentId },
    });

    
    if (!studentGroups.length) {
      return res.status(200).json({
        message: `No home tasks for student ID: ${studentId}`,
        data: [],
      });
    }

    
    const groupIds = studentGroups.map((group) => group.GroupId);

   
    const homeTasks = await HomeTask.findAll({
      where: {
        GroupId: { [Op.in]: groupIds }, 
      },
      include: [
        {
          model: Group,
          as: 'Group',
          attributes: ['GroupId', 'GroupName'],
        },
      ],
    });

    const DoneHomeTasks = await DoneHomeTask.findAll({
      attributes: ['HomeTaskId'],
      where: { StudentId: studentId },
    });
    const DoneHomeTaskIds = DoneHomeTasks.map((task) => task.HomeTaskId);
    const filteredHomeTasks = homeTasks.filter(
      (task) => !DoneHomeTaskIds.includes(task.HomeTaskId)
    );
    res.status(200).json({
      message: `Home tasks for student ID: ${studentId}`,
      data: filteredHomeTasks,
    });
  } catch (error) {
    console.error('Error in getNewHomeTasksByStudentId:', error);
    res.status(500).json({
      message: `Error in getNewHomeTasksByStudentId: ${error.message}`,
    });
  }
};

//   try {
//       const { subject, maxGrade, taskDescription, taskHeader } = req.body;
//       const teacherFiles = req.files['teacherFiles'] || [];
//       const studentFiles = req.files['studentFiles'] || [];

//       console.log("teacherFiles.lenght: ", teacherFiles.length);

//       function getFileType(fileName) {
//           const ext = fileName.split('.').pop().toLowerCase();
//           if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
//           if (ext === 'pdf') return 'pdf';
//           if (ext === 'docx') return 'docx';
//           if (ext === 'pptx') return 'pptx';
//           if (ext === 'xlsx') return 'xlsx';
//           if (ext === 'json') return 'json';
//           if (ext === 'csv') return 'csv';
//           if (ext === 'xml') return 'xml';
//           if (['txt', 'js', 'html', 'css', 'md'].includes(ext)) return 'text';
//           return 'unknown';
//       }

//       /*  "tasks": [Масив завдань, усі що були у всіх прикріплених учителем файлах] [
//       "task": завдання{
//               "Question": [Запитання або приклад до завдання, яке поставив учитель],
//               "RightAnswer": [Правильний овтет на завдання дані вчителем, для отримання ти маєш сам вирішити це завдання],
//               "StudentAnswer": [Відповідь на це завдання, яку написав у своєму рішенні учень],
//               "IsStudentMadeRightAnswer": [true або false, необхідно порівняти rightAnswer і studentAnswer і зрозуміти чи правильно учень зробив завдання],
//               "MaxMark": [int Максимальна оцінка конкретно за це завдання, її потрібно вирахувати залежно від складності та кількості інших завдань, але в сумі всі MaxMark кожного завдання повинні давати рівно ${maxGrade} балів],
//               "StudentMark": [int Залежно від того наскільки правильно учень розв'язав саме це завдання виставити оцінку від 0 до MaxMark],
//               "Comment": [Опис чому конкретно за це завдання виставлено саме StudentMark балів]
//       }
//   ]*/

//       const messages = [
//           {
//               role: 'user',
//               content: [
//                   {
//                       type: 'text',
//                       text: `
// Ти - суворий учитель, який перевіряє домашнє завдання з предмета ${subject}. Оціни завдання за шкалою від 0 до ${maxGrade} балів.

// Завдання:
// ${taskHeader}

// Опис завдання:
// ${taskDescription}

// Ретельно проаналізуй завдання і відповідь учня та чесно й об'єктивно оціни роботу учня за шкалою від 0 до ${maxGrade} без поблажок і поясни, чому ти поставив цю оцінку. Ти використовуєшся в API додатку, тож поверни відповідь строго в такому json форматі, без інших зайвих речень, твоя відповідь має починатися з "{" і закінчуються з "}":
// {
//   "Mark": [Поставлена тобою оцінка],
//   "Comment": [Пояснення чому оцінка саме така]
// {
// `,
//                   },
//               ],
//           },
//       ];

//       for (const file of teacherFiles) {
//           const fileType = getFileType(file.originalname);

//           console.log("===== File type: ", fileType);

//           if (fileType === 'text') {
//               const content = fs.readFileSync(file.path, 'utf8');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (${file.originalname}):\n${content}`,
//               });
//           } else if (fileType === 'pdf') {
//               console.log("!!!!!!!!!!! pdf");
//               const pdfData = await pdfParse(fs.readFileSync(file.path));
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (PDF: ${file.originalname}):\n${pdfData.text}`,
//               });
//           } else if (fileType === 'image') {
//               const imageBuffer = fs.readFileSync(file.path);
//               const base64Image = imageBuffer.toString('base64');
//               const mimeType = mime.lookup(file.originalname) || 'image/jpeg';
//               messages[0].content.push({
//                   type: 'image_url',
//                   image_url: { url: `data:${mimeType};base64,${base64Image}` },
//               });
//           } else if (fileType === 'docx') {
//               console.log("!!!!!!!!!!! docx");
//               const docx = require('mammoth');
//               const { value: docxText } = await docx.extractRawText({ path: file.path });
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (DOCX: ${file.originalname}):\n${docxText}`,
//               });
//           } else if (fileType === 'pptx') {
//               const pptxParser = require('pptx2txt');
//               const pptxText = await pptxParser.getText(file.path);
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (PPTX: ${file.originalname}):\n${pptxText}`,
//               });
//           } else if (fileType === 'xlsx') {
//               const xlsx = require('xlsx');
//               const workbook = xlsx.readFile(file.path);
//               const sheetNames = workbook.SheetNames;
//               const xlsxText = sheetNames.map(name => xlsx.utils.sheet_to_csv(workbook.Sheets[name])).join('\n');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (XLSX: ${file.originalname}):\n${xlsxText}`,
//               });
//           } else if (fileType === 'json') {
//               const jsonData = fs.readFileSync(file.path, 'utf8');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (JSON: ${file.originalname}):\n${jsonData}`,
//               });
//           } else if (fileType === 'csv') {
//               const csvData = fs.readFileSync(file.path, 'utf8');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (CSV: ${file.originalname}):\n${csvData}`,
//               });
//           } else if (fileType === 'xml') {
//               const xmlData = fs.readFileSync(file.path, 'utf8');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Материалы учителя (XML: ${file.originalname}):\n${xmlData}`,
//               });
//           } else {
//               messages[0].content.push({
//                   type: 'text',
//                   text: `[Неподдерживаемый файл учителя: ${file.originalname}]`,
//               });
//           }
//       }


//       for (const file of studentFiles) {
//           const fileType = getFileType(file.originalname);
//           if (fileType === 'text') {
//               const content = fs.readFileSync(file.path, 'utf8');
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Работа ученика (${file.originalname}):\n${content}`,
//               });
//           } else if (fileType === 'pdf') {
//               const pdfData = await pdfParse(fs.readFileSync(file.path));
//               messages[0].content.push({
//                   type: 'text',
//                   text: `Работа ученика (PDF: ${file.originalname}):\n${pdfData.text}`,
//               });
//           } else if (fileType === 'image') {
//               const imageBuffer = fs.readFileSync(file.path);
//               const base64Image = imageBuffer.toString('base64');
//               const mimeType = mime.lookup(file.originalname) || 'image/jpeg';
//               messages[0].content.push({
//                   type: 'image_url',
//                   image_url: { url: `data:${mimeType};base64,${base64Image}` },
//               });
//           } else {
//               messages[0].content.push({
//                   type: 'text',
//                   text: `[Неподдерживаемый файл ученика: ${file.originalname}]`,
//               });
//           }
//       }

//       const response = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: messages,
//           temperature: 0.2,
//           top_p: 1.0,
//           frequency_penalty: 0.0,
//           presence_penalty: 0.1,
//       });

//       const result = response.choices[0].message.content;

//       const regex = /\{[\s\S]*\}/;
//       const match = result.match(regex);

//       if (match) {
//           const jsonContent = match[0];
//           try {
//               const parsedJSON = JSON.parse(jsonContent);
//               res.json(parsedJSON);
//           } catch (error) {
//               res.status(500).json({ error: 'Ошибка при разборе JSON' });
//           }
//       } else {
//           res.status(500).json({ error: 'Не найден JSON-объект в ответе' });
//       }

//       [...teacherFiles, ...studentFiles].forEach(file => fs.unlinkSync(file.path));

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Ошибка при проверке' });
//   }
// }

// Функция для скачивания файла по URL
async function downloadFile(url) {
  const tempDir = os.tmpdir();
  const fileName = path.basename(url.split('?')[0]); 
  const filePath = path.join(tempDir, fileName);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

exports.checkWithAI = async (req, res) => {
  try {
    const { subject, maxGrade, taskDescription, taskHeader, teacherFiles, studentFiles } = req.body;

    const downloadedTeacherFiles = await Promise.all(teacherFiles.map(downloadFile));
    const downloadedStudentFiles = await Promise.all(studentFiles.map(downloadFile));

    const teacherFilesObjects = downloadedTeacherFiles.map(filePath => ({
      path: filePath,
      originalname: path.basename(filePath),
    }));
    const studentFilesObjects = downloadedStudentFiles.map(filePath => ({
      path: filePath,
      originalname: path.basename(filePath),
    }));

    function getFileType(fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
      if (ext === 'pdf') return 'pdf';
      if (ext === 'docx') return 'docx';
      if (ext === 'pptx') return 'pptx';
      if (ext === 'xlsx') return 'xlsx';
      if (ext === 'json') return 'json';
      if (ext === 'csv') return 'csv';
      if (ext === 'xml') return 'xml';
      if (['txt', 'js', 'html', 'css', 'md'].includes(ext)) return 'text';
      return 'unknown';
    }

    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `
Ти - суворий учитель, який перевіряє домашнє завдання з предмета ${subject}. Оціни завдання за шкалою від 0 до ${maxGrade} балів.

Завдання:
${taskHeader}

Опис завдання:
${taskDescription}

Ретельно проаналізуй завдання і відповідь учня та чесно й об'єктивно оціни роботу учня за шкалою від 0 до ${maxGrade} без поблажок і поясни, чому ти поставив цю оцінку. Ти використовуєшся в API додатку, тож поверни відповідь строго в такому json форматі, без інших зайвих речень, твоя відповідь має починатися з "{" і закінчуються з "}":
{
  "Mark": [Поставлена тобою оцінка],
  "Comment": [Пояснення чому оцінка саме така]
}
`,
          },
        ],
      },
    ];

    for (const file of teacherFilesObjects) {
      const fileType = getFileType(file.originalname);
      if (fileType === 'text') {
        const content = fs.readFileSync(file.path, 'utf8');
        messages[0].content.push({
          type: 'text',
          text: `Материалы учителя (${file.originalname}):\n${content}`,
        });
      } else if (fileType === 'pdf') {
        const pdfData = await pdfParse(fs.readFileSync(file.path));
        messages[0].content.push({
          type: 'text',
          text: `Материалы учителя (PDF: ${file.originalname}):\n${pdfData.text}`,
        });
      } else if (fileType === 'image') {
        const imageBuffer = fs.readFileSync(file.path);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = mime.lookup(file.originalname) || 'image/jpeg';
        messages[0].content.push({
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${base64Image}` },
        });
      } else if (fileType === 'docx') {
        const docx = require('mammoth');
        const { value: docxText } = await docx.extractRawText({ path: file.path });
        messages[0].content.push({
          type: 'text',
          text: `Материалы учителя (DOCX: ${file.originalname}):\n${docxText}`,
        });
      } else {
        messages[0].content.push({
          type: 'text',
          text: `[Неподдерживаемый файл учителя: ${file.originalname}]`,
        });
      }
    }

    for (const file of studentFilesObjects) {
      const fileType = getFileType(file.originalname);
      if (fileType === 'text') {
        const content = fs.readFileSync(file.path, 'utf8');
        messages[0].content.push({
          type: 'text',
          text: `Работа ученика (${file.originalname}):\n${content}`,
        });
      } else if (fileType === 'pdf') {
        const pdfData = await pdfParse(fs.readFileSync(file.path));
        messages[0].content.push({
          type: 'text',
          text: `Работа ученика (PDF: ${file.originalname}):\n${pdfData.text}`,
        });
      } else if (fileType === 'image') {
        const imageBuffer = fs.readFileSync(file.path);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = mime.lookup(file.originalname) || 'image/jpeg';
        messages[0].content.push({
          type: 'image_url',
          image_url: { url: `data:${mimeType};base64,${base64Image}` },
        });
      } else {
        messages[0].content.push({
          type: 'text',
          text: `[Неподдерживаемый файл ученика: ${file.originalname}]`,
        });
      }
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.2,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.1,
    });

    const result = response.choices[0].message.content;
    const regex = /\{[\s\S]*\}/;
    const match = result.match(regex);

    if (match) {
      const jsonContent = match[0];
      try {
        const parsedJSON = JSON.parse(jsonContent);
        console.log("parsedJSON: ", parsedJSON);
        res.json(parsedJSON);
      } catch (error) {
        res.status(500).json({ error: 'Ошибка при разборе JSON' });
      }
    } else {
      res.status(500).json({ error: 'Не найден JSON-объект в ответе' });
    }

    [...downloadedTeacherFiles, ...downloadedStudentFiles].forEach(filePath => fs.unlinkSync(filePath));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при проверке' });
  }
};

exports.getHomeTasksDataByTeacherId = async (req, res) => {
  const { userId } = req.params;

  try {
    const teacher = await Teacher.findOne({
      where: { UserId: userId },
      include: [
        {
          model: Course,
          as: 'Courses',
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['SubjectName'],
            },
            {
              model: Group,
              as: 'Groups',
              include: [
                {
                  model: HomeTask,
                  as: 'HomeTasks',
                  include: [
                    {
                      model: HomeTaskFile,
                      as: 'HomeTaskFiles',
                      attributes: ['HomeTaskFileId', 'FilePath', 'FileName'],
                    },
                    {
                      model: DoneHomeTask,
                      as: 'DoneHomeTasks',
                      include: [
                        {
                          model: DoneHomeTaskFile,
                          as: 'DoneHomeTaskFiles',
                          attributes: ['HometaskFileId', 'FilePath', 'FileName'],
                        },
                        {
                          model: Student,
                          as: 'Student',
                          include: [
                            {
                              model: User,
                              as: 'User',
                              attributes: ['UserId', 'LastName', 'FirstName', 'ImageFilePath'],
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
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Учитель с данным userId не найден' });
    }

    const groupIds = teacher.Courses.flatMap(course => course.Groups.map(group => group.GroupId));

    const studentCounts = await GroupStudent.findAll({
      attributes: ['GroupId', [Sequelize.fn('COUNT', Sequelize.col('StudentId')), 'StudentAmount']],
      where: { GroupId: groupIds },
      group: ['GroupId'],
    });

    const studentCountMap = studentCounts.reduce((map, count) => {
      map[count.GroupId] = count.get('StudentAmount');
      return map;
    }, {});

    const groupStudentsDetails = await GroupStudent.findAll({
      where: { GroupId: groupIds },
      include: [
        {
          model: Student,
          as: 'Student',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['UserId', 'LastName', 'FirstName', 'ImageFilePath'],
            },
          ],
        },
      ],
    });

    const groupStudentsMap = {};
    groupStudentsDetails.forEach(gs => {
      const groupId = gs.GroupId;
      if (!groupStudentsMap[groupId]) {
        groupStudentsMap[groupId] = [];
      }
      groupStudentsMap[groupId].push(gs.Student);
    });

    const result = {
      TeacherId: teacher.TeacherId,
      Courses: teacher.Courses.map(course => ({
        CourseId: course.CourseId,
        CourseName: course.CourseName,
        Groups: course.Groups.map(group => ({
          GroupId: group.GroupId,
          GroupName: group.GroupName,
          StudentAmount: studentCountMap[group.GroupId] || 0,
          Hometasks: group.HomeTasks.map(hometask => {
            const doneStudentIds = hometask.DoneHomeTasks.map(dht => dht.Student.StudentId);
            const allGroupStudents = groupStudentsMap[group.GroupId] || [];
            const notDoneStudents = allGroupStudents
              .filter(student => !doneStudentIds.includes(student.StudentId))
              .map(student => ({
                UserId: student.User.UserId,
                LastName: student.User.LastName,
                FirstName: student.User.FirstName,
                ImageFilePath: student.User.ImageFilePath,
              }));

            return {
              HometaskId: hometask.HomeTaskId,
              SubjectName: course.Subject.SubjectName,
              HometaskHeader: hometask.HomeTaskHeader,
              HomeTaskDescription: hometask.HomeTaskDescription,
              HometaskCover: hometask.ImageFilePath,
              HometaskStartDate: hometask.StartDate,
              HometaskDeadlineDate: hometask.DeadlineDate,
              MaxMark: hometask.MaxMark,
              HometaskFiles: hometask.HomeTaskFiles.map(file => ({
                Id: file.HomeTaskFileId,
                Filepath: file.FilePath,
                FileName: file.FileName,
              })),
              DoneHometasks: hometask.DoneHomeTasks.map(doneHometask => ({
                DoneHometaskId: doneHometask.DoneHomeTaskId,
                Mark: doneHometask.Mark,
                DoneDate: doneHometask.DoneDate,
                DoneHometaskFiles: doneHometask.DoneHomeTaskFiles.map(file => ({
                  Id: file.HometaskFileId,
                  Filepath: file.FilePath,
                  FileName: file.FileName,
                })),
                Student: {
                  StudentId: doneHometask.Student.StudentId,
                  UserId: doneHometask.Student.User.UserId,
                  LastName: doneHometask.Student.User.LastName,
                  FirstName: doneHometask.Student.User.FirstName,
                  ImageFilePath: doneHometask.Student.User.ImageFilePath,
                },
              })),
              NotDoneHometaskStudents: notDoneStudents,
            };
          }),
        })),
      })),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении данных учителя:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.getHometaskLastImageByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findByPk(groupId, {
      include: [{
        model: Course,
        as: 'Course'
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const course = group.Course;
    
    if (!course) {
      return res.status(200).json({ imagePath: null });
    }

    const courseWithGroups = await Course.findByPk(course.CourseId, {
      include: [{
        model: Group,
        as: 'Groups',
        include: [{
          model: HomeTask,
          as: 'HomeTasks'
        }]
      }]
    });

    const allHomeTasks = [];
    courseWithGroups.Groups.forEach(group => {
      if (group.HomeTasks && group.HomeTasks.length > 0) {
        allHomeTasks.push(...group.HomeTasks);
      }
    });

    if (allHomeTasks.length === 0) {
      return res.status(200).json({ imagePath: null });
    }

    const latestHomeTask = allHomeTasks.sort((a, b) => 
      new Date(b.StartDate) - new Date(a.StartDate)
    )[0];

    return res.status(200).json({ imagePath: latestHomeTask.ImageFilePath });
  }
  catch (ex) {
    console.error('Error retrieving last home task image:', ex);
    return res.status(500).json({ message: 'Internal server error', error: ex.message });
  }
}