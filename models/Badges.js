module.exports = (sequelize, DataTypes) => {
    return sequelize.define("badge", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
	
};
