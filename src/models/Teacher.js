const {DataTypes}=require('sequelize');
const sequelize=require('../config/database');
const User=require('./User');

const Teacher=sequelize.define('Teacher',{
    TeacherId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    AboutTeacher:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    LessonPrice:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    LessonType:{
        type: DataTypes.ENUM('group', 'solo'),
        allowNull:false,
    },
    MeetingType:{
        type:DataTypes.ENUM('offline','online'),
        allowNull:false
    },
    //Исправить после создания модель Subscription 
    SubscriptionLevelId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'UserId',
        },
        onDelete:'CASCADE'
    }

},{tableName:'Teachers',timestamps:false});

User.hasOne(Teacher,{foreignKey:'UserId'});
Teacher.belongsTo(User,{foreignKey:'UserId'});

module.exports=Teacher;