// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("node:fs");

const { getCommandCategories } = require("./utilities/commandFunctions.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { graveyardID, devServerID, token, development } = require(`${__basedir }/configs/graveyard_config.json`);

// these are categories that should not be added into the main bots commands.
const categoriesToSkip = ["development", "dummy"];

// this is where we will store all the commands
const commands = [];
const categoryFolders = getCommandCategories();

//* loop through all the categories, and push each command in a respective category to the commands array.
for (const category of categoryFolders) {
    //* skips dev commands being pushed to the main version of the bot
    if (development === false && categoriesToSkip.includes(category)) continue;

    const commandFiles = fs.readdirSync(`${__basedir}/commands/${category}`)
        .filter(commandFile => commandFile.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const command = require(`${__basedir}/commands/${category}/${commandFile}`);
        command.category = category;
        
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "9" }).setToken(token);

if (development === true) {
    rest.put(Routes.applicationGuildCommands(graveyardID, devServerID), { body: commands })
        .then(() => console.log("Registered application commands in the development server."))
        .catch(console.error);
} else {
    rest.put(Routes.applicationCommands(graveyardID), { body: commands })
        .then(() => console.log("Registered application commands globally."))
        .catch(console.error);
}

