module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userInventory", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};