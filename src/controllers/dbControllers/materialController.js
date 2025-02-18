const { Material, Teacher } = require('../../models/dbModels');
const { parseQueryParams } = require('../../utils/dbUtils/queryUtils');
const { Op } = require('sequelize');

exports.createMaterial = async (req, res) => {
    try {
        const material = await Material.create(req.body);
        res.status(201).json(material);
    } catch (error) {
        console.error('Error in createMaterial:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getMaterials = async (req, res) => {
    try {
        const { order, ParentId } = req.query;
        const whereConditions = {};
        whereConditions.ParentId = ParentId ?? null;
        const materials = await Material.findAll({
            where: whereConditions,
            order: order || undefined,
        });
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error in getMaterials:', error);
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
        const { MaterialName, Type, TeacherId, FilePath, FileImage, appearanceDateFrom, appearanceDateTo, ParentId } = req.query;
        const whereConditions = {};

        if (MaterialName) whereConditions.MaterialName = { [Op.like]: `%${MaterialName}%` };
        if (Type) whereConditions.Type = Type;
        if (TeacherId) whereConditions.TeacherId = TeacherId;
        if (ParentId) whereConditions.ParentId = ParentId;
        if (FilePath) whereConditions.FilePath = { [Op.like]: `%${FilePath}%` };
        if (FileImage) whereConditions.FileImage = { [Op.like]: `%${FileImage}%` };
        if (appearanceDateFrom || appearanceDateTo) {
            whereConditions.AppearanceDate = {};
            if (appearanceDateFrom) whereConditions.AppearanceDate[Op.gte] = new Date(appearanceDateFrom);
            if (appearanceDateTo) whereConditions.AppearanceDate[Op.lte] = new Date(appearanceDateTo);
        }

        const materials = await Material.findAll({
            where: whereConditions,
            // include: {
            //     model: Teacher,
            //     as: 'Teacher',
            //     attributes: ['TeacherId', 'Name'],
            // },
        });

        if (!materials.length) {
            return res.status(404).json({ success: false, message: 'No materials found matching the criteria.' });
        }

        return res.status(200).json({ success: true, data: materials });
    } catch (error) {
        console.error('Error in searchMaterials:', error);
        return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
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