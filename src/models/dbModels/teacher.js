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
            allowNull: false,
            validate: {
                notEmpty: { msg: 'LessonType cannot be empty' },
            },
        },
        MeetingType: {
            type: DataTypes.ENUM('offline', 'online'),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'MeetingType cannot be empty' },
            },
        },
        UserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return Teacher;
};