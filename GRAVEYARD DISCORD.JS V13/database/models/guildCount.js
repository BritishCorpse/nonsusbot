module.exports = (sequelize, DataTypes) => {
    return sequelize.define("guildCount", {
        guildId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        currentNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        incorrectlyCounted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        correctlyCounted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastCounterUserID: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};