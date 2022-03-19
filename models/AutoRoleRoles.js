module.exports = (sequelize, DataTypes) => {
    return sequelize.define("auto_role_roles", {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role_id: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 