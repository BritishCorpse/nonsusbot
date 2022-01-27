module.exports = (sequelize, DataTypes) => {
    return sequelize.define("users", {
        user_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        balance: { 
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        badge: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastDaily: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastWeekly: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastWorked: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastRobbed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: false,
    });
};
 
