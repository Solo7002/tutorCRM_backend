
const {Sequilize,DataTypes}=require('sequelize');
const sequelize = require('../config/database');

const User=sequelize.define('User',{
    UserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
      },
    Username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    Password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    LastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    FirstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    Email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    ImageFilePath:{
        type:DataTypes.STRING,
        allowNull: true
    },
    TeacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      StudentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },    
},{tableName:'Users',timestamps:false});

module.exports=User;