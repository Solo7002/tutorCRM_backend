require('dotenv').config(); 
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

module.exports = sequelize;