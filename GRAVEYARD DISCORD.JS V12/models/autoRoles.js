module.exports = (sequelize, DataTypes) => {
    return sequelize.define("autoRoles", {
        guildId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        roleId: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 