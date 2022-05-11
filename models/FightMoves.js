module.exports = (sequelize, DataTypes) => {
    return sequelize.define("fight_moves", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        effectiveness: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        affect: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        accuracy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        target: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
	
};
