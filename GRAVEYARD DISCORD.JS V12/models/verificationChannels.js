module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verificationChannels", {
        guildId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        channel: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
        messageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 