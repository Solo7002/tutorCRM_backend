module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        imageFilePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
    });

    User.associate = (models) => {
        User.hasOne(models.Student, {
            foreignKey: 'userId',
            as: 'student'
        });
        User.hasOne(models.Teacher, {
            foreignKey: 'userId',
            as: 'teacher'
        });
    };

    return User;
};  