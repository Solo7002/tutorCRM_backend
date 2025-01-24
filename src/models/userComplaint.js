module.exports = (sequelize, DataTypes) => {
    const UserComplaint = sequelize.define('UserComplaint', {
      userComplaintId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      complaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      complaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    UserComplaint.associate = (models) => {
      UserComplaint.belongsTo(models.User, {
        foreignKey: 'userFromId',
        as: 'userFrom'
      });
      UserComplaint.belongsTo(models.User, {
        foreignKey: 'userForId',
        as: 'userFor'
      });
    };
  
    return UserComplaint;
  };  