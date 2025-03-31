module.exports = (sequelize, DataTypes) => {
    const Trophies = sequelize.define('Trophies', {
        TrophyId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        StudentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'Students',
                key: 'StudentId',
            },
        },
        Amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: { args: [0], msg: 'Trophies cannot be negative' },
            },
        },
    }, {
        tableName: 'Trophies',
        timestamps: false,
    });

    Trophies.associate = (models) => {
        Trophies.belongsTo(models.Student, {
            foreignKey: 'StudentId',
            as: 'Student',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Trophies;
};