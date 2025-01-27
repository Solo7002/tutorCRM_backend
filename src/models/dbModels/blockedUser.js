module.exports = (sequelize, DataTypes) => {
  const BlockedUser = sequelize.define('BlockedUser', {
    BlockedId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ReasonDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Reason description is required', },
        len: { args: [1, 500], msg: 'Reason description must not exceed 500 characters', },
      },
    },
    BanStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Ban start date must be a valid date', },
        notNull: { msg: 'Ban start date is required', },
      },
    },
    BanEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: 'Ban end date must be a valid date', },
        isAfterStartDate(value) {
          if (value && this.BanStartDate && value <= this.BanStartDate) {
            throw new Error('Ban end date must be after the start date');
          }
        },
      },
    }
  }, {
    timestamps: false,
  });

  BlockedUser.associate = (models) => {
    BlockedUser.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'User'
    });
  };

  return BlockedUser;
};  