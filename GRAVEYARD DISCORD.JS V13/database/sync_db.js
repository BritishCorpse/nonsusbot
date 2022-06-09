// Set the base directory to remove relative paths
global.__basedir = __dirname;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "botdatabase.db",
});

require(`${__basedir}/models/userFinance.js`)(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(async () => {
    console.log("All database tables synced.");

    sequelize.close();
}).catch(console.error);
