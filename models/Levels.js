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
        exp: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reqExp: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastMessage: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
	
};
