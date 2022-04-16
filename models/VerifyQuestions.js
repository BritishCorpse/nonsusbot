module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verify_questions", {
        guild_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question: {
            type: DataTypes.STRING,
            //unique: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};
 