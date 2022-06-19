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
const userInventory = require("./database/models/userInventory.js")(sequelize, Sequelize.DataTypes);

const currencyShop = require("./database/models/currencyShop.js")(sequelize, Sequelize.DataTypes);

async function getCountingGuild(guildId) {
    let guild = await guildCount.findOne({ where: { guildId: guildId } }) || null;

    if (guild === null) {
        await guildCount.create({ guildId: guildId });
        guild = await guildCount.findOne({ where: { guildId: guildId } });
    }

    return guild;
}

async function getCountingUser(userId) {
    let user = await userCount.findOne({ where: { userId: userId } }) || null;

    if (user === null) {
        await userCount.create({ userId: userId });
        user = await userCount.findOne({ where: { userId: userId } });
    }

    return user;
}

async function getCurrencyUser(userId) {
    let user = await userCurrency.findOne({ where: { userId: userId } }) || null;

    if (user === null) {
        await userCurrency.create({ userId: userId });
        user = await userCurrency.findOne({ where: { userId: userId } });
    }

    return user;
}

//
//! Shop 
//

Reflect.defineProperty(currencyShop, "getItem", {
    value: async (itemId) => {
        return currencyShop.findOne({ where: { itemId: itemId } });
    }
});


//
//! Inventory
//

Reflect.defineProperty(userInventory, "getItems", {
    value: async (userId) => {
        return userInventory.findAll({
            where: { userId: userId }
        });
    }
});

Reflect.defineProperty(userInventory, "getItem", {
    value: async (userId, itemId) => {
        return userInventory.findOne({ where: { itemId: itemId, userId: userId } });
    }
});

Reflect.defineProperty(userInventory, "addItem", {
    value: async (userId, itemId, amount) => {
        const item = await userInventory.getItem(userId, itemId);

        if (!item) {
            return userInventory.create({
                userId: userId,
                itemId: itemId,
                amount: amount
            });
        }

        item.amount += amount;
        item.save();

        return;
    }
});

//
//! Currency
//

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

//
//! Counting system
//

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
    userCurrency,
    userInformation,
    getCountingGuild,
    getCountingUser,
    getCurrencyUser,
    currencyShop, 
    userInventory,
};
