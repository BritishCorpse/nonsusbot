module.exports = (sequelize, DataTypes) => {
    return sequelize.define("levels", {
        userId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        guildId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        XP: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        requiredXP: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastSentMessageTimeStamp: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
	
};
