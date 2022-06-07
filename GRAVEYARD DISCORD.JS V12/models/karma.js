module.exports = (sequelize, DataTypes) => {
    return sequelize.define("karma", {
        userId: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            primaryKey: true,
        },
        karma: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
};
 
