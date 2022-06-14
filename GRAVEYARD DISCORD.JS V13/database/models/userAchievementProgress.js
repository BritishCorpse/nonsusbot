module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userAchievements", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commandsUsed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        coinsSpent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        coinsEarned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        numbersCounted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};