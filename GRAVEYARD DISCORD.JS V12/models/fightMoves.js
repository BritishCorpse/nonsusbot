module.exports = (sequelize, DataTypes) => {
    return sequelize.define("fightMoves", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        timestamps: false,
    });
	
};
