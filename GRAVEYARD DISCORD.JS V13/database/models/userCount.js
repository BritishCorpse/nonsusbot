module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userCount", {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
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
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};