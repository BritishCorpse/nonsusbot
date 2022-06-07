module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verificationMessages", {
        guildId: {
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