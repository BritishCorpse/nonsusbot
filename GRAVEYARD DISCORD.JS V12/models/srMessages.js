module.exports = (sequelize, DataTypes) => {
    return sequelize.define("srMessages", {
        messageId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        channelId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
};
 
