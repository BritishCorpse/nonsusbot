module.exports = (sequelize, DataTypes) => {
    return sequelize.define("wallets", {
        userId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
};
 
