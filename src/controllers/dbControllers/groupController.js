const { Group, GroupStudent,Course,Teacher } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error in createGroup:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const groups = await Group.findAll({
      where: where || undefined,
      order: order || undefined,
    });
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error in getGroups:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.status(200).json(group);
  } catch (error) {
    console.error('Error in getGroupById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchGroups = async (req, res) => {
  try {
    const { groupName, minPrice, maxPrice } = req.query;
    const whereConditions = {};

    if (groupName) whereConditions.GroupName = { [Op.like]: `%${groupName}%` };
    if (minPrice && maxPrice) {
      whereConditions.GroupPrice = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    } else if (minPrice) {
      whereConditions.GroupPrice = { [Op.gte]: parseFloat(minPrice) };
    } else if (maxPrice) {
      whereConditions.GroupPrice = { [Op.lte]: parseFloat(maxPrice) };
    }

    const groups = await Group.findAll({
      where: whereConditions,
      include: {
        model: GroupStudent,
        as: 'Students',
        attributes: ['GroupId', 'StudentId'],
      },
    });

    if (!groups.length) {
      return res.status(404).json({ success: false, message: 'No groups found matching the criteria.' });
    }

    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    console.error('Error in searchGroups:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    await group.update(req.body);
    res.status(200).json(group);
  } catch (error) {
    console.error('Error in updateGroup:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    await group.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteGroup:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupsByTeacherId = async (req, res) => {
  try {
    const { id } = req.params; 

    
    if (!id) {
      return res.status(400).json({ error: "TeacherId is required" });
    }


    const groups = await Group.findAll({
      include: [
        {
          model: Course,
          as: "Course",
          include: [
            {
              model: Teacher,
              as: "Teacher",
              where: { TeacherId: id },
            },
          ],
        },
      ],
    });

  
    if (!groups || groups.length === 0) {
      return res.status(404).json({ error: "No groups found for this teacher" });
    }

   
    const groupInfo = groups.map((group) => ({
      GroupId: group.GroupId,
      GroupName: group.GroupName,
      CourseName: group.Course ? group.Course.CourseName : null, 
    }));

    res.status(200).json(groupInfo);
  } catch (error) {
    console.error("Error in getGroupsByTeacher:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupsByCourseId=async(req,res)=>{
  try{
    const {id}=req.params;

    const groups = await Group.findAll({
      where: { 'CourseId': id },
      raw:true
    });
    const groupsWithStudentCount = await Promise.all(
      groups.map(async (group) => {
        const studentCount = await GroupStudent.count({
          where: { 'GroupId': group.GroupId },
        });
        return {
          ...group,
          studentCount,
        };
      })
    );

    res.status(200).json(groupsWithStudentCount);
  }catch(error){
    console.error('Error in getGroupsByCourseId:', error);
    res.status(400).json({ error: error.message });
  }
}