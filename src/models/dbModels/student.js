module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        StudentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        SchoolName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'SchoolName cannot be empty' },
                len: { args: [1, 255], msg: 'SchoolName must be between 1 and 255 characters' },
            },
        },
        Grade: {
            type: DataTypes.STRING,
            allowNull: false,
             validate: {
                notEmpty: { msg: 'Grade cannot be empty' },
                len: { args: [1, 50], msg: 'Grade must be between 1 and 50 characters' },
            },
        }
    }, {
        timestamps: false,
    });

    Student.associate = (models) => {
        Student.belongsTo(models.User, {
            foreignKey: 'UserId',
            as: 'User'
        });
    };

    return Student;
};  