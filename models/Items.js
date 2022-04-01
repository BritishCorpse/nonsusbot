module.exports = (sequelize, DataTypes) => {
    return sequelize.define("items", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        item_emoji: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
	
};
