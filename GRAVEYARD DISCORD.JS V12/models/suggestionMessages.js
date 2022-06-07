module.exports = (sequelize, DataTypes) => {
    return sequelize.define("suggestionMessages", {
        messageId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        sentAt: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 