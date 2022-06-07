module.exports = (sequelize, DataTypes) => {
    return sequelize.define("users", {
        id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: false,
        },
        badge: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rank: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
};
 
