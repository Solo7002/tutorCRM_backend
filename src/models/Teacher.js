module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
        teacherId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        aboutTeacher: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lessonPrice: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lessonType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['group', 'solo']]
            }
        },
        meetingType: {
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
            foreignKey: 'userId',
            as: 'user'
        });
        Teacher.hasMany(models.Course, {
            foreignKey: 'teacherId',
            as: 'courses'
        });
    };

    return Teacher;
};  