module.exports = (sequelize, DataTypes) => {
    const UserComplaint = sequelize.define('UserComplaint', {
      complaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      complaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {});
  
    UserComplaint.associate = (models) => {
      UserComplaint.belongsTo(models.user, {
        foreignKey: 'userFromId',
        as: 'userFrom'
      });
      UserComplaint.belongsTo(models.user, {
        foreignKey: 'userForId',
        as: 'userFor'
      });
    };
  
    return UserComplaint;
  };  