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
            unique: true,
            validate: {
                notEmpty: { msg: 'Username cannot be empty' },
                len: { args: [3, 50], msg: 'Username must be between 3 and 50 characters' },
            },
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Password cannot be empty' },
                len: { args: [6, 100], msg: 'Password must be at least 6 characters long' },
                isNotUsername(value) {
                    if (value === this.Username) {
                        throw new Error('Password cannot be the same as the Username');
                    }
                }
            },
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'LastName cannot be empty' },
            },
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'FirstName cannot be empty' },
            },
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Email must be a valid email address' },
                notEmpty: { msg: 'Email cannot be empty' },
            },
        },
        ImageFilePath: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: { msg: 'ImageFilePath must be a valid URL' },
            },
        },
        CreateDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
    });

    return User;
};  