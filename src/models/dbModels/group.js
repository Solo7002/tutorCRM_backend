module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
      GroupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      GroupName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      GroupPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      ImageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    Group.associate = (models) => {
      Group.hasMany(models.GroupStudent, {
        foreignKey: 'GroupId',
        as: 'Students'
      });
    };
  
    return Group;
  };  