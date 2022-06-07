module.exports = (sequelize, DataTypes) => {
    return sequelize.define("srRoles", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emoji: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
 
