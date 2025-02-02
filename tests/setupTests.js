const { sequelize } = require('../src/models/dbModels');

beforeEach(async () => {
  try {
    if (sequelize.options.dialect === 'sqlite') {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { raw: true });
      await sequelize.sync({ force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { raw: true });
    }
  } catch (error) {
    console.error('Error during sequelize sync:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Error closing Sequelize connection:', error);
  }
});