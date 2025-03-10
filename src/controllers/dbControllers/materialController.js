const { Material, Teacher } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');
const path = require("path");
const { createFile } = require('../fileController');

exports.createMaterial = async (req, res) => {
    try {
        const file = req.file;
        const fileName = await createFile(file);
        const material = await Material.create({
            MaterialName: req.body.MaterialName || file.originalname,
            Type: "file",
            ParentId: req.body.ParentId || null,
            TeacherId: req.body.TeacherId || null,
            FilePath: fileName,
            FileImage: null
        });
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

exports.searchMaterials = async (req, res) => {
    try {
        const { MaterialName, Type, TeacherId, FileExtension, FileImage, appearanceDateFrom, appearanceDateTo, ParentId } = req.query;
        const whereConditions = {};

        if (MaterialName){ 
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