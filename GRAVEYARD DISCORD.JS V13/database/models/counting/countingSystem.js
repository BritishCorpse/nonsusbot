module.exports = (sequelize, DataTypes) => {
    return sequelize.define("countingSystem", {
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
        lastCountedUserID: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
};