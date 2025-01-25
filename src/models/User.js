module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        UserId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ImageFilePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CreateDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
    });

    User.associate = (models) => {
        User.hasOne(models.Student, {
            foreignKey: 'UserId',
            as: 'student'
        });
        User.hasOne(models.Teacher, {
            foreignKey: 'UserId',
            as: 'teacher'
        });
    };

    return User;
};  