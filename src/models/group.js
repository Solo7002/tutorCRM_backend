module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
      groupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      groupPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      imageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {});
  
    Group.associate = (models) => {
      Group.hasMany(models.GroupStudent, {
        foreignKey: 'groupId',
        as: 'students'
      });
    };
  
    return Group;
  };  