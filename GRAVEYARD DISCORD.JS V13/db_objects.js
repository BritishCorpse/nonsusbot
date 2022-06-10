const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.db",
});

const guildCount = require("./database/models/guildCount.js")(sequelize, Sequelize.DataTypes);
const userCount = require("./database/models/userCount.js")(sequelize, Sequelize.DataTypes);

async function getCountingGuild(guildId) {
    const guild = guildCount.findOne({ where: { guildId: guildId } }) || null;

    if (guild === null) {
        const guild = guildCount.create({ guildId: guildId });

        return guild;
    }

    return guild;
}

async function getCountingUser(userId) {
    const user = userCount.findOne({ where: { guildId: userId } }) || null;

    if (user === null) {
        const user = userCount.create({ guildId: userId });

        return user;
    }

    return user;
}

Reflect.defineProperty(guildCount, "addIncorrectCount", {
    value: async (guildId, userId) => {
        const guild = await getCountingGuild(guildId);
        const user = await getCountingUser(userId);

        guild.incorrectlyCounted += 1;
        user.incorrectlyCounted += 1;

        user.save();
        guild.save();

        return;
    }
});

Reflect.defineProperty(guildCount, "addCorrectCount", {
    value: async (guildId, userId) => {
        const guild = await getCountingGuild(guildId);
        const user = await getCountingUser(userId);


        guild.correctlyCounted += 1;
        user.correctlyCounted += 1;
        
        guild.save();
        user.save();

        return;
    }
});

Reflect.defineProperty(guildCount, "resetGuildCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.currentNumber = 1;

        return guild.save();
    }
});

Reflect.defineProperty(guildCount, "setLastCounterUserID", {
    value: async (guildId, userId) => {
        const guild = await getCountingGuild(guildId);

        guild.lastCounterUserID = userId;

        return guild.save();
    }
});

Reflect.defineProperty(guildCount, "addOneToGuildCount", {
    value: async guildId => {
        const guild = await getCountingGuild(guildId);

        guild.currentNumber += 1;

        return guild.save();
    }
});

module.exports = { userCount, guildCount, getCountingGuild };
