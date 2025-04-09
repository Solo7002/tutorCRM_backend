const { GroupStudent, Group, Student, User } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op, where } = require('sequelize');

exports.createGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.create(req.body);
    res.status(201).json(groupStudent);
  } catch (error) {
    console.error('Error in createGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupStudents = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const groupStudents = await GroupStudent.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(groupStudents);
  } catch (error) {
    console.error('Error in getGroupStudents:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupStudentById = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });
    res.status(200).json(groupStudent);
  } catch (error) {
    console.error('Error in getGroupStudentById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchGroupStudents = async (req, res) => {
  try {
    const { groupId, studentId } = req.query;
    const whereConditions = {};

    if (groupId) whereConditions.GroupId = groupId;
    if (studentId) whereConditions.StudentId = studentId;

    const groupStudents = await GroupStudent.findAll({
      where: whereConditions,
      include: [
        {
          model: Group,
          as: 'Group',
          attributes: ['GroupId', 'GroupName'],
        },
        {
          model: Student,
          as: 'Student',
          attributes: ['StudentId', 'FirstName', 'LastName'],
        },
      ],
    });

    if (!groupStudents.length) {
      return res.status(404).json({ success: false, message: 'No group students found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: groupStudents });
  } catch (error) {
    console.error('Error in searchGroupStudents:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findByPk(req.params.id);
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });

    await groupStudent.update(req.body);
    res.status(200).json(groupStudent);
  } catch (error) {
    console.error('Error in updateGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGroupStudent = async (req, res) => {
  try {
    const groupStudent = await GroupStudent.findOne({where:{GroupId: req.params.groupid, StudentId: req.params.studentid}});
    if (!groupStudent) return res.status(404).json({ error: "GroupStudent not found" });

    await groupStudent.destroy();
    res.status(200).json({ message: 'GroupStudent deleted' });
  } catch (error) {
    console.error('Error in deleteGroupStudent:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.createGroupStudentFromNotification = async (data) => {
  try {
      const { StudentId, GroupId, JoinDate } = data;

      // Check if the student exists
      const student = await Student.findByPk(StudentId);
      if (!student) {
          throw new Error(`Student with ID ${StudentId} does not exist`);
      }

      // Check if the group exists
      const group = await Group.findByPk(GroupId);
      if (!group) {
          throw new Error(`Group with ID ${GroupId} does not exist`);
      }

      // Create the GroupStudent record
      const groupStudent = await GroupStudent.create({
          StudentId,
          GroupId,
          JoinDate,
      });

      return groupStudent;
  } catch (err) {
      console.error('Error in createGroupStudentFromNotification:', err);
      throw err;
  }
};

exports.findStudentByUserId = async (userId) => {
  try {
      const student = await Student.findOne({ where: { UserId: userId } });
      if (!student) {
          throw new Error(`Student with UserId ${userId} not found`);
      }
      return student.StudentId;
  } catch (err) {
      console.error('Error in findStudentByUserId:', err);
      throw err;
  }
};