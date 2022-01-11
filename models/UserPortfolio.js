module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_item", {
        user_id: DataTypes.STRING,
        stock_id: DataTypes.INTEGER,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            "default": 0,
        },
    }, {
        timestamps: false,
    });
};
