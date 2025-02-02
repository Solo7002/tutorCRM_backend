const path = require('path');

const env = process.env.NODE_ENV || 'development';
console.log(`Loading configuration for environment: ${env}`);

let configPath;
if (env === 'test') {
  configPath = path.join(__dirname, 'database.test.js');
} else {
  configPath = path.join(__dirname, 'database.js');
}

module.exports = require(configPath);