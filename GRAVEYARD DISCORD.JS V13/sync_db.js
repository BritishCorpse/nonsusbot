const Sequelize = require("sequelize");
const { log } = require("./utilities/botLogFunctions.js");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.db",
});

require("./database/models/guildCount.js")(sequelize, Sequelize.DataTypes);

require("./database/models/userCount.js")(sequelize, Sequelize.DataTypes);
require("./database/models/userCurrency.js")(sequelize, Sequelize.DataTypes);
require("./database/models/userInformation.js")(sequelize, Sequelize.DataTypes);
require("./database/models/userInventory.js")(sequelize, Sequelize.DataTypes);

const currencyShop = require("./database/models/currencyShop.js")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

let shop;
sequelize.sync({ force }).then(async () => {
    shop = [
        await currencyShop.upsert({ itemId: 1000, itemName: "Carrot", itemDescription: "Just a carrot.", itemCost: 100, isAvailableToBuy: true }),
        await currencyShop.upsert({ itemId: 2000, itemName: "Disguise", itemDescription: "Hide yourself from others for a week!", itemCost: 10000, isAvailableToBuy: true }),
        await currencyShop.upsert({ itemId: 3000, itemName: "Cat", itemDescription: "What a cute kitty!", itemCost: 3000, isAvailableToBuy: true }),
        await currencyShop.upsert({ itemId: 4000, itemName: "Dog", itemDescription: "Strong doggie.", itemCost: 3000, isAvailableToBuy: true }),
        await currencyShop.upsert({ itemid: 999999, itemName: "Illegal item!", itemDescription: "This item is not available to buy!", itemCost: 100000, isAvailableToBuy: false })
    ];

    await Promise.all(shop);

    log("Database synced.");



    sequelize.close();
});

module.exports = {
    shop
};
