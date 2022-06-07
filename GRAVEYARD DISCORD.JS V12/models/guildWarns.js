module.exports = (sequelize, DataTypes) => {
    return sequelize.define("guildWarns", {
        guildId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 
