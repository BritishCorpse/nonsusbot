module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userFinance", {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};