module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
        TeacherId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        AboutTeacher: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [0, 255], msg: 'AboutTeacher must be up to 255 characters' },
            },
        },
        LessonPrice: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: 'LessonPrice must be an integer' },
            },
        },
        LessonType: {
            type: DataTypes.ENUM('group', 'solo'),
            allowNull: true,
            validate: {
                isIn: {
                    args: [['group', 'solo', null]],
                    msg: 'LessonType must be either "group", "solo", or null',
                },
            },
        },
        MeetingType: {
            type: DataTypes.ENUM('offline', 'online'),
            allowNull: true,
            validate: {
                isIn: {
                    args: [['offline', 'online', null]],
                    msg: 'MeetingType must be either "offline", "online", or null',
                },
            },
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        SubscriptionLevelId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Subscriptions',
                key: 'SubscriptionLevelId',
            },
        },
        OctoCoinId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: 'OctoCoins',
                key: 'OctoCoinId',
            },
        },
    }, {
        timestamps: false,
    });

    Teacher.associate = (models) => {
        Teacher.belongsTo(models.User, {
            foreignKey: 'UserId',
            as: 'User',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Teacher.hasOne(models.OctoCoins, {
            foreignKey: 'TeacherId',
            as: 'OctoCoins',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Teacher;
};