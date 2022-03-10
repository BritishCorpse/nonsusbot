module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_roles", {
/*        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },*/
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emoji: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 
