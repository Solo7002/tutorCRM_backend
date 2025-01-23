'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReviewComplaints', {
      ReviewComplaintId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ComplaintDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      ComplaintDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      UserFromId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'CASCADE',
      },
      ReviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'UserReviews',
          key: 'UserReviewId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReviewComplaints');
  },
};