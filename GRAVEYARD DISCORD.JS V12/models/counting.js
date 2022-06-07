// TODO: remove allowNull: true ????? shouldn't be null
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("counting", {
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
        guildTotalCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: false,
    });
	
};
