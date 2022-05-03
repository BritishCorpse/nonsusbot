module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_warns", {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        warning: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        guild_id: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        warnId: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 
