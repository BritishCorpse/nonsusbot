module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_channels", {
        guild_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        channel_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
