module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verify_messages", {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};