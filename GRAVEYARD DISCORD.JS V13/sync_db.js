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

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(async () => {
    log("Database synced.");

    sequelize.close();
});
