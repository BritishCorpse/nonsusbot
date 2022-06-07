module.exports = (sequelize, DataTypes) => {
    return sequelize.define("bot", {
        goodbots: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            default: 1,
        },
        badBots: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            default: 1,
        }
    }, {
        timestamps: false,
    });
	
};
