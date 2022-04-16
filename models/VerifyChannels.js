module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verify_channels", {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        channel: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
        message_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 