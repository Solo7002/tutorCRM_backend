const { Material, Teacher, Course, Group, Student, User, MaterialVisibilityStudent } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const path = require("path");
const { createFile } = require('../fileController');

exports.createMaterial = async (req, res) => {
    try {
        const file = req.file;
        const fileName = req.body.Type == "file" ? await createFile(req, res, file) : null;
        const material = await Material.create({
            MaterialName: req.body.MaterialName || file.originalname,
            Type: req.body.Type,
            ParentId: req.body.ParentId || null,
            TeacherId: req.body.TeacherId || null,
            FilePath: ("https://blobstorage226122007.blob.core.windows.net/blob-storage-container/" + fileName) || null,
            FileImage: null
        });

        if (req.body.ParentId != null){
            const parent = await Material.findByPk(req.body.ParentId, {
                include: [
                    {
                        model: Student,
                        as: 'VisibleStudents',
                        through: { attributes: [] }
                    }
                ]
            })
            await updateMaterialAccess(material.MaterialId, parent.VisibleStudents.map(student => student.StudentId), []);
        }
        
        
        res.status(201).json(material);
    } catch (error) {
        console.error('Error in createMaterial:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getMaterials = async (req, res) => {
    try {
        const { order, FileExtension, ParentId } = req.query;
        const whereConditions = {};
        whereConditions.ParentId = ParentId ?? null;

        let orderBy;
        switch (order) {
            case "Спочатку нові":
                orderBy = [['AppearanceDate', 'DESC']];
                break;
            case "Спочатку старі":
                orderBy = [['AppearanceDate', 'ASC']];
                break;
            case "За алфавітом":
                orderBy = [['MaterialName', 'ASC']];
                break;
            default:
                orderBy = null;
        }

        let materials = await Material.findAll({
            where: whereConditions,
            order: orderBy,
        });

        if (FileExtension) {
            const extensionsArray = Array.isArray(FileExtension) ? FileExtension : [FileExtension];

            materials = materials.filter(material => {
                if (material.Type === 'folder') return true;
                const ext = path.extname(material.FilePath || "").toLowerCase();
                return extensionsArray.map(e => e.toLowerCase()).includes(ext);
            });
        }
        materials.sort((a, b) => {
            if (a.Type === "folder" && b.Type !== "folder") return -1;
            if (a.Type !== "folder" && b.Type === "folder") return 1;
            return 0;
        });

        res.status(200).json(materials);
    } catch (error) {
        console.error("Error in getMaterials:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getMaterialsByStudentUserId = async (req, res) => {
    try {
        const { order, FileExtension, ParentId } = req.query;

        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Student,
                as: 'Student',
                include: [{
                    model: Material,
                    as: 'VisibleMaterials',
                    where: { ParentId: ParentId ?? null },
                    order: determineOrder(order)
                }]
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.Student) {
            return res.status(200).json([]);
        }

        let materials = user.Student.VisibleMaterials;

        if (FileExtension) {
            const extensionsArray = Array.isArray(FileExtension) ? FileExtension : [FileExtension];
            materials = materials.filter(material => {
                if (material.Type === 'folder') return true;
                const ext = path.extname(material.FilePath || "").toLowerCase();
                return extensionsArray.map(e => e.toLowerCase()).includes(ext);
            });
        }

        materials.sort((a, b) => {
            if (a.Type === "folder" && b.Type !== "folder") return -1;
            if (a.Type !== "folder" && b.Type === "folder") return 1;
            return 0;
        });

        res.status(200).json(materials);
    } catch (error) {
        console.error("Error in getMaterialsByStudentUserId:", error);
        res.status(400).json({ error: error.message });
    }
};

function determineOrder(order) {
    switch (order) {
        case "Спочатку нові":
            return [['AppearanceDate', 'DESC']];
        case "Спочатку старі":
            return [['AppearanceDate', 'ASC']];
        case "За алфавітом":
            return [['MaterialName', 'ASC']];
        default:
            return null;
    }
}

exports.getMaterialById = async (req, res) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json(material);
    } catch (error) {
        console.error('Error in getMaterialById:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getMaterialByUserId = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Teacher,
                    as: 'Teacher',
                    include: [
                        {
                            model: Material,
                            as: 'Materials'
                        }
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const teacher = user.Teacher;
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found for this user' });
        }

        const materials = teacher.Materials || [];

        const response = {
            TeacherId: teacher.TeacherId,
            Materials: materials
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getMaterialByUserId:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getstudentsByMaterialId = async (req, res) => {
    try {
        const materialId = req.params.id;

        const material = await Material.findByPk(materialId, {
            include: [
                {
                    model: Student,
                    as: 'VisibleStudents',
                    through: { attributes: [] }
                }
            ]
        });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        const teacher = await Teacher.findByPk(material.TeacherId, {
            include: [
                {
                    model: Course,
                    as: 'Courses',
                    include: [
                        {
                            model: Group,
                            as: 'Groups',
                            include: [
                                {
                                    model: Student,
                                    as: 'Students',
                                    through: { attributes: [] },
                                    include: [
                                        {
                                            model: User,
                                            as: 'User'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const visibleStudentsMap = {};
        material.VisibleStudents.forEach(student => {
            visibleStudentsMap[student.StudentId] = true;
        });

        const response = {
            MaterialId: material.MaterialId,
            TeacherId: teacher.TeacherId,
            Courses: teacher.Courses.map(course => {
                return {
                    CourseId: course.CourseId,
                    CourseName: course.CourseName,
                    Groups: course.Groups.map(group => {
                        return {
                            GroupId: group.GroupId,
                            GroupName: group.GroupName,
                            Students: group.Students.map(student => {
                                return {
                                    StudentId: student.StudentId,
                                    UserId: student.User.UserId,
                                    FirstName: student.User.FirstName,
                                    LastName: student.User.LastName,
                                    hasAccessToMaterial: visibleStudentsMap[student.StudentId] ? true : false
                                };
                            })
                        };
                    })
                };
            })
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getstudentsByMaterial:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.setAccessToMaterial = async (req, res) => {
    try {
        const materialId = req.params.id;
        const studentIds = req.body;
        if (!Array.isArray(studentIds)) {
            return res.status(400).json({ message: 'Student IDs must be an array' });
        }
        const uniqueStudentIds = [...new Set(studentIds)].map(id => parseInt(id, 10));
        const material = await Material.findByPk(materialId, {
            include: [
                {
                    model: Student,
                    as: 'VisibleStudents',
                    through: { attributes: [] }
                }
            ]
        });
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        const currentVisibleStudentIds = material.VisibleStudents.map(student => student.StudentId);
        const studentsToAdd = uniqueStudentIds.filter(id => !currentVisibleStudentIds.includes(id));
        const studentsToRemove = currentVisibleStudentIds.filter(id => !uniqueStudentIds.includes(id));

        await grantAccessToMaterialAndContents(materialId, studentsToAdd, studentsToRemove);

        if (studentsToAdd.length > 0) {
            await grantAccessToAncestors(materialId, studentsToAdd);
        }

        return res.status(200).json({ message: 'Access updated successfully' });
    } catch (error) {
        console.error('Error updating access to material:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

async function grantAccessToMaterialAndContents(materialId, studentsToAdd, studentsToRemove) {
    const material = await Material.findByPk(materialId, {
        include: [
            {
                model: Material,
                as: 'Materials',
            }
        ]
    });
    if (!material) return;

    await updateMaterialAccess(materialId, studentsToAdd, studentsToRemove);

    if (material.Type === 'folder' && material.Materials && material.Materials.length > 0) {
        for (const childMaterial of material.Materials) {
            await grantAccessToMaterialAndContents(childMaterial.MaterialId, studentsToAdd, studentsToRemove);
        }
    }
}

async function grantAccessToAncestors(materialId, studentsToAdd) {
    let currentMaterial = await Material.findByPk(materialId, {
        include: [
            {
                model: Material,
                as: 'Parent',
            }
        ]
    });
    while (currentMaterial && currentMaterial.ParentId !== null) {
        const parentId = currentMaterial.ParentId;
        await updateMaterialAccess(parentId, studentsToAdd, []);
        currentMaterial = await Material.findByPk(parentId, {
            include: [
                {
                    model: Material,
                    as: 'Parent',
                }
            ]
        });
    }
}

async function updateMaterialAccess(materialId, studentsToAdd, studentsToRemove) {
    if (studentsToRemove.length > 0) {
        await MaterialVisibilityStudent.destroy({
            where: {
                MaterialId: materialId,
                StudentId: studentsToRemove
            }
        });
    }
    if (studentsToAdd.length > 0) {
        const existingRelations = await MaterialVisibilityStudent.findAll({
            where: {
                MaterialId: materialId,
                StudentId: studentsToAdd
            },
            attributes: ['MaterialId', 'StudentId']
        });
        const existingStudentIds = existingRelations.map(relation => relation.StudentId);
        const studentsToActuallyAdd = studentsToAdd.filter(id => !existingStudentIds.includes(id));
        if (studentsToActuallyAdd.length > 0) {
            const newRelations = studentsToActuallyAdd.map(studentId => ({
                MaterialId: materialId,
                StudentId: studentId
            }));
            await MaterialVisibilityStudent.bulkCreate(newRelations);
        }
    }
}

exports.searchMaterials = async (req, res) => {
    try {
        const { MaterialName, Type, TeacherId, FileExtension, FileImage, appearanceDateFrom, appearanceDateTo, ParentId } = req.query;
        const whereConditions = {};

        if (MaterialName) {
            whereConditions.MaterialName = { [Op.like]: `%${MaterialName}%` };
        }
        if (Type) whereConditions.Type = Type;
        if (TeacherId) whereConditions.TeacherId = TeacherId;
        if (ParentId) whereConditions.ParentId = ParentId;
        if (FileImage) whereConditions.FileImage = { [Op.like]: `%${FileImage}%` };
        if (appearanceDateFrom || appearanceDateTo) {
            whereConditions.AppearanceDate = {};
            if (appearanceDateFrom) whereConditions.AppearanceDate[Op.gte] = new Date(appearanceDateFrom);
            if (appearanceDateTo) whereConditions.AppearanceDate[Op.lte] = new Date(appearanceDateTo);
        }


        let materials = await Material.findAll({ where: whereConditions });

        if (FileExtension) {
            const extensionsArray = Array.isArray(FileExtension) ? FileExtension : [FileExtension];
            materials = materials.filter(material => {
                if (material.Type === 'folder') return true;
                const ext = path.extname(material.FilePath || "").toLowerCase();
                return extensionsArray.map(e => e.toLowerCase()).includes(ext);
            });
        }
        return res.status(200).json({ success: true, data: materials });
    } catch (error) {
        console.error("Error in searchMaterials:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later." });
    }
};


exports.updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });

        await material.update(req.body);
        res.status(200).json(material);
    } catch (error) {
        console.error('Error in updateMaterial:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) return res.status(404).json({ message: 'Material not found' });

        await material.destroy();
        res.status(200).json({ message: 'Material deleted' });
    } catch (error) {
        console.error('Error in deleteMaterial:', error);
        res.status(400).json({ error: error.message });
    }
};