module.exports = (sequelize, DataTypes) => {
    const OctoCoins = sequelize.define('OctoCoins', {
        OctoCoinId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        TeacherId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'Teachers',
                key: 'TeacherId',
            },
        },
        Amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: { args: [0], msg: 'OctoCoins cannot be negative' },
            },
        },
    }, {
        tableName: 'OctoCoins',
        timestamps: false,
    });

    OctoCoins.associate = (models) => {
        OctoCoins.belongsTo(models.Teacher, {
            foreignKey: 'TeacherId',
            as: 'Teacher',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return OctoCoins;
};