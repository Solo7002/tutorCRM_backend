const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../../config/database');

const sequelize = dbConfig;
const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && 
      file !== 'index.js' && 
      file.slice(-3) === '.js' && 
      file !== 'associations.js'
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