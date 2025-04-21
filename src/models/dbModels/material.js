module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
        MaterialId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        MaterialName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'MaterialName cannot be empty' },
                len: { args: [1, 255], msg: 'MaterialName must be between 1 and 255 characters' },
            },
        },
        Type: {
            type: DataTypes.ENUM('file', 'folder'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['file', 'folder']],
                    msg: 'Type must be either "file" or "folder"',
                },
                notEmpty: { msg: 'Type cannot be empty' },
            },
        },
        FilePath: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                len: { args: [1, 255], msg: 'FilePath must be between 1 and 255 characters' },
            },
        },
        FileImage: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isUrl: { msg: 'FileImage must be a valid URL' },
                len: { args: [1, 255], msg: 'FileImage must be between 1 and 255 characters' },
            },
        },
        AppearanceDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: { msg: 'AppearanceDate must be a valid date' },
            },
        },
        ParentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Materials',
                key: 'MaterialId',
            },
            onDelete: 'CASCADE',
        },
        TeacherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Teachers',
                key: 'TeacherId',
            },
            onDelete: 'CASCADE',
        },
    }, {
        timestamps: false,
    });

    return Material;
};