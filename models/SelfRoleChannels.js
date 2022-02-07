module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_channels", {
        guildId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
