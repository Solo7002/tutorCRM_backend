require('dotenv').config({ path: '.env.test' });

const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || ':memory:',
  logging: false,
});