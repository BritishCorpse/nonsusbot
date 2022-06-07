module.exports = (sequelize, DataTypes) => {
    return sequelize.define("portfolios", {
        userId: DataTypes.STRING,
        shareId: DataTypes.STRING,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        timestamps: false,
    });
};
