module.exports = (sequelize, DataTypes) => {
    return sequelize.define("srChannels", {
        guildId: {
            type: DataTypes.STRING,
            allowNull: false
            //primaryKey: true
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
