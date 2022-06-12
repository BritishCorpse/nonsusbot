module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userAchievements", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sentMessagesTotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        moneyEarned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};