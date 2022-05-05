module.exports = (sequelize, DataTypes) => {
    return sequelize.define("suggestion_messages", {
        message_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        sent_at: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};
 