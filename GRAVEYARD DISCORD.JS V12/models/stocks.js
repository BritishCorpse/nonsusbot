module.exports = (sequelize, DataTypes) => {
    return sequelize.define("stocks", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        oldPrice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currentPrice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        averageChange: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lastUpdated: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amountBought: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }

    }, {
        timestamps: false,
    });
};
 
