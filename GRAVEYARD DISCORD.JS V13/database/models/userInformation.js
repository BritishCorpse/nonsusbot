module.exports = (sequelize, DataTypes) => {
    return sequelize.define("userInformation", {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        rank: {
            type: DataTypes.STRING,
            defaultValue: "No rank",
            allowNull: false,
        },
    }, {
        timestamps: false,
        //makes it so it doesnt set the table to plural
        freezeTableName: true,
    });
};