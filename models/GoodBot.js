module.exports = (sequelize, DataTypes) => {
    return sequelize.define("goodbot", {
        goodbots: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false,
            default: 1,
        },
    }, {
        timestamps: false,
    });
	
};
