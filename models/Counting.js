module.exports = (sequelize, DataTypes) => {
    return sequelize.define("countings", {
        guildId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        number : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lastCounterId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guildCounted: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: false,
    });
	
};
