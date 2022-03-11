module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        guild_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
    });
};
 
