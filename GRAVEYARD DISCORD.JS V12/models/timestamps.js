module.exports = (sequelize, DataTypes) => {
    return sequelize.define("timestamps", {
        userId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            primaryKey: true,
        },
        daily: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: 0,
        },
        weekly: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: 0,
        },
        message: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};
 
