module.exports = (sequelize, DataTypes) => {
    return sequelize.define("currencyShop", {
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        itemCost: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isAvailableToBuy: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};