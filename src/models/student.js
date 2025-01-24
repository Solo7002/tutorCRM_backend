const {DataTypes} = require('sequelize');
const sequelize=require('../config/database');
const User=require('./User');

const Student=sequelize.define('Student',{
    StudentId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    SchoolName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Grade:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'UserId',
        },
        onDelete:'CASCADE',
    },
},{tableName:'Students',timestamps:false});

User.hasOne(Student,{foreignKey:'UserId'});
Student.belongsTo(User,{foreignKey:'UserId'});

module.exports=Student;