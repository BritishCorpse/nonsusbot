module.exports = (sequelize, DataTypes) => {
    return sequelize.define("fight_moves", {
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
