module.exports = (sequelize, DataTypes) => {
    const UserComplaint = sequelize.define('UserComplaint', {
      UserComplaintId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ComplaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      ComplaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    UserComplaint.associate = (models) => {
      UserComplaint.belongsTo(models.User, {
        foreignKey: 'UserFromId',
        as: 'UserFrom'
      });
      UserComplaint.belongsTo(models.User, {
        foreignKey: 'UserForId',
        as: 'UserFor'
      });
    };
  
    return UserComplaint;
  };  