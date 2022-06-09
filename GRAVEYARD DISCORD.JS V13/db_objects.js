const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.db",
});

const countingSystem = require("./database/models/countingSystem.js")(sequelize, Sequelize.DataTypes);

async function getCountingGuild(guildId) {
    const guild = countingSystem.findOne({ where: { guildId: guildId } }) || null;

    if (guild === null) {
        const guild = countingSystem.create({ guildId: guildId });

        return guild;
    }

    return guild;
}

Reflect.defineProperty(countingSystem, "addIncorrectCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.incorrectlyCounted += 1;

        return guild.save();
    }
});

Reflect.defineProperty(countingSystem, "addCorrectCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.correctlyCounted += 1;

        return guild.save();
    }
});

Reflect.defineProperty(countingSystem, "resetGuildCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.currentNumber = 1;

        return guild.save();
    }
});

Reflect.defineProperty(countingSystem, "setLastCounterUserID", {
    value: async (guildId, userId) => {
        const guild = await getCountingGuild(guildId);

        guild.lastCounterUserID = userId;

        return guild.save();
    }
});

Reflect.defineProperty(countingSystem, "addOneToGuildCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.currentNumber += 1;

        return guild.save();
    }
});

module.exports = { countingSystem, getCountingGuild };
