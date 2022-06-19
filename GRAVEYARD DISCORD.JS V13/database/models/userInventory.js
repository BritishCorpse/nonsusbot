module.exports = (sequelize, DataTypes) => {
    return sequelize.define("currencyShop", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};