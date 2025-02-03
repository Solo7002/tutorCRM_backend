const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../../config/database');
const basename = path.basename(__filename);
const db = {};

const sequelize = dbConfig;

const modelOrder = [
  'User', 
  'Student',
  'Teacher', 
  'Location',
  'Subject', 
  'Course', 
  'Group', 
  'GroupStudent', 
  'HomeTask', 
  'HomeTaskFile',
  'DoneHomeTask',
  'DoneHomeTaskFile', 
  'MarkHistory', 
  'Material', 
  'PlannedLesson', 
  'Test',
  'TestQuestion', 
  'TestAnswer', 
  'SelectedAnswer',
  'DoneTest', 
  'UserComplaint', 
  'UserPhone', 
  'UserReview', 
  'StudentCourseRating',
  'SaleMaterial', 
  'SaleMaterialFile'
];

modelOrder.forEach(file => {
  const model = require(path.join(__dirname, `${file}.js`))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && 
      file !== basename && 
      file.slice(-3) === '.js' && 
      !modelOrder.includes(file.slice(0, -3)) && 
      file !== 'associations.js' && 
      file.indexOf('.test.js') === -1 
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

require('./associations')(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;