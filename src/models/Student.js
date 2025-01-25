module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        StudentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        SchoolName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Grade: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
    });

    Student.associate = (models) => {
        Student.belongsTo(models.User, {
            foreignKey: 'UserId',
            as: 'user'
        });
    };

    return Student;
};  