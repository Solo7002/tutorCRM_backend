const { log } = require('winston');
const { Subject,HomeTask,Group,Course } = require('../../models/dbModels');
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