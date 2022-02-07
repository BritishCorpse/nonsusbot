module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_roles", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
