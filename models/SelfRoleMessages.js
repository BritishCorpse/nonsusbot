module.exports = (sequelize, DataTypes) => {
    return sequelize.define("self_role_messages", {
        message_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
