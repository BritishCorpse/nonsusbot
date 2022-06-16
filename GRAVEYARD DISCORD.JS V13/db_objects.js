const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.db",
});

const guildCount = require("./database/models/guildCount.js")(sequelize, Sequelize.DataTypes);
const userCount = require("./database/models/userCount.js")(sequelize, Sequelize.DataTypes);
const userCurrency = require("./database/models/userCurrency.js")(sequelize, Sequelize.DataTypes);
const userInformation = require("./database/models/userInformation.js")(sequelize, Sequelize.DataTypes);

async function getCountingGuild(guildId) {
    const guild = await guildCount.findOne({ where: { guildId: guildId } }) || null;
    return guild;
}

async function getCountingUser(userId) {
    let user = await userCount.findOne({ where: { userId: userId } }) || null;

    if (user === null) {
        user = await userCount.create({ userId: userId });
    }

    return user;
}

async function getCurrencyUser(userId) {
    let user = await userCurrency.findOne({ where: { userId: userId } }) || null;

    if (user === null) {
        user = await userCurrency.create({ userId: userId });
    }

    return user;
}

Reflect.defineProperty(userCurrency, "addBalance", {
    value: async (userId, amount) => {
        const user = await getCurrencyUser(userId);

        user.balance += amount;
        user.save();

        return;
    }
});

Reflect.defineProperty(userCurrency, "getBalance", {
    value: async (userId) => {
        const user = await getCurrencyUser(userId);

        return user.balance;
    }
});

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

module.exports = { 
    userCount, 
    guildCount, 
    getCountingGuild,
    getCurrencyUser,
    userCurrency,
    userInformation
};
