module.exports = (sequelize, DataTypes) => {
    return sequelize.define("inventories", {
        userId: DataTypes.STRING,
        itemId: DataTypes.INTEGER,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        timestamps: false,
    });
};
