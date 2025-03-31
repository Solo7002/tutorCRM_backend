const { log } = require('winston');
const { Subject,HomeTask,Group,Course,Student } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error in createSubject:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const subjects = await Subject.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error in getSubjects:', error);
    res.status(400).json({ error: error.message });
  }
};
exports.getSubjectByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ error: "GroupId is required" });
    }

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: Course,
          as: "Course",
          include: [
            {
              model: Subject,
              as: "Subject",
            },
          ],
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.Course || !group.Course.Subject) {
      return res.status(404).json({ error: "Subject not found for this group" });
    }

    const subjectInfo = {
      GroupId: group.GroupId,
      GroupName: group.GroupName,
      CourseName: group.Course.CourseName,
      SubjectName: group.Course.Subject.SubjectName,
    };

    console.log(subjectInfo); 

    res.status(200).json(subjectInfo);
  } catch (error) {
    console.error("Error in getSubjectByGroupId:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.status(200).json(subject);
  } catch (error) {
    console.error('Error in getSubjectById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchSubjects = async (req, res) => {
  try {
    const { subjectName } = req.query;
    const whereConditions = {};

    if (subjectName) whereConditions.SubjectName = { [Op.like]: `%${subjectName}%` };

    const subjects = await Subject.findAll({
      where: whereConditions,
      attributes: ['SubjectId', 'SubjectName'],
    });

    if (!subjects.length) {
      return res.status(404).json({ success: false, message: 'No subjects found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    console.error('Error in searchSubjects:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    await subject.update(req.body);
    res.status(200).json(subject);
  } catch (error) {
    console.error('Error in updateSubject:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    await subject.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteSubject:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getNameSubjectByIdHometask = async (req, res) => {
  try {
    const { hometaskId } = req.params;

    const homeTask = await HomeTask.findByPk(hometaskId, {
        include: {
            model: Group,
            as: 'Group',
            include: {
                model: Course,
                as: 'Course',
                include: {
                    model: Subject,
                    as: 'Subject',
                    attributes: ['SubjectName']
                    
                }
            }
        }
    });
 
   
    if (!homeTask?.Group?.Course?.Subject?.SubjectName) {
      return res.status(404).json({ message: 'Dont search' });
  }


    res.json({
        SubjectName: homeTask.Group.Course.Subject.SubjectName,
        
    });

} catch (error) {
    res.status(500).json({ message: 'Error subject:', error: error.message });
}
};

exports.getSubjectsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Находим студента по ID и включаем связанные группы
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Group,
        as: 'Groups', // Алиас для групп студента
        include: [{
          model: Course,
          as: 'Course', // Алиас для курса в группе
          include: [{
            model: Subject,
            as: 'Subject', // Алиас для предмета в курсе
            attributes: ['SubjectId', 'SubjectName']
          }]
        }]
      }]
    });

    // Если студент не найден
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }


    const subjects = [];
    const subjectMap = new Map(); 
    student.Groups.forEach(group => {
      if (group.Course && group.Course.Subject) {
        const subject = group.Course.Subject;
        if (!subjectMap.has(subject.SubjectId)) {
          subjectMap.set(subject.SubjectId, true);
          subjects.push({
            SubjectId: subject.SubjectId,
            SubjectName: subject.SubjectName
          });
        }
      }
    });


    if (subjects.length === 0) {
      return res.status(404).json({ message: 'No subjects found for this student' });
    }

 
    res.json(subjects);

  } catch (error) {
    console.error('Error retrieving subjects:', error);
    res.status(500).json({ message: 'Error retrieving subjects', error: error.message });
  }
};