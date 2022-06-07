module.exports = (sequelize, DataTypes) => {
    return sequelize.define("warns", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        warning: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        guildId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        id: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 
