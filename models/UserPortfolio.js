module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_portfolios", {
        user_id: DataTypes.STRING,
        share_id: DataTypes.STRING,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            "default": 0,
        },
    }, {
        timestamps: false,
    });
};
