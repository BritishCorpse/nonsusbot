module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_karma", {
        user_id: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            primaryKey: true,
        },
        karma: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
};
 
