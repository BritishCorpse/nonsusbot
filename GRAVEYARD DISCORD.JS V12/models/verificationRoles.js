module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verificationRoles", {
        guildId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 
