// Set the base directory to remove relative paths
const __basedir = __dirname;

const Sequelize = require("sequelize");
const fs = require("node:fs");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "botdatabase.db",
});

const categoryFolders = fs.readdirSync(`${__basedir}/models`);

for (const category of categoryFolders) {
    const modelFiles = fs.readdirSync(`${__basedir}/models/${category}`)
        .filter(modelFile => modelFile.endsWith(".js"));

    for (const modelFile of modelFiles) {
        const model = require(`${__basedir}/models/${category}/${modelFile}`)(sequelize, Sequelize.DataTypes);
        model.category = category;
    }
}

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize.sync({ force }).then(async () => {
    console.log("All database tables synced.");

    sequelize.close();
}).catch(console.error);
