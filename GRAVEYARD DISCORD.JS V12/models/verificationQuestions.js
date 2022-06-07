module.exports = (sequelize, DataTypes) => {
    return sequelize.define("verificationQuestions", {
        guildId: {
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
 