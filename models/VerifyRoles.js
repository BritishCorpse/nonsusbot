module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verify_roles", {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 
