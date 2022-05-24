module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_profiles", {
        user_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20
        },
        strength: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
        },
        defence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
        },
        health_potions: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 3
        },
        mana_potions: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 3
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        xp: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
        moveset: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Bite, Punch, Kick, Stab"
        },
        special_ability: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Healer"
        }

    }, {
        timestamps: false,
    });
};
 
