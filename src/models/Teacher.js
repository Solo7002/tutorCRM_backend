module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
        TeacherId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        AboutTeacher: {
            type: DataTypes.STRING,
            allowNull: true
        },
        LessonPrice: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        LessonType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['group', 'solo']]
            }
        },
        MeetingType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['offline', 'online']]
            }
        }
    }, {
        timestamps: false,
    });

    Teacher.associate = (models) => {
        Teacher.belongsTo(models.User, {
            foreignKey: 'UserId',
            as: 'user'
        });
        Teacher.hasMany(models.Course, {
            foreignKey: 'TeacherId',
            as: 'courses'
        });
    };

    return Teacher;
};