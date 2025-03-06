module.exports = (sequelize, DataTypes) => {
  const GroupStudent = sequelize.define('GroupStudent', {
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'StudentId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'GroupId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    JoinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'JoinDate must be a valid date' },
      },
    },
  }, {
    timestamps: false,
  });

  return GroupStudent;
};