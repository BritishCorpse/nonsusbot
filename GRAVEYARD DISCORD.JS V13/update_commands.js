// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("node:fs");

const { getCommandCategories } = require("./utilities/commandFunctions.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { log } = require("./utilities/botLogFunctions.js");
const { bot_id, token} = require(`${__basedir }/configs/graveyard_config.json`);

const { dev_server_id, in_development } = require(`${__basedir}/configs/development_config.json`);

// these are categories that should not be added into the main bots commands.
const categoriesToSkip = ["in_development", "dummy"];

// this is where we will store all the commands
const commands = [];
const categoryFolders = getCommandCategories();

//* loop through all the categories, and push each command in a respective category to the commands array.
for (const category of categoryFolders) {
    //* skips dev commands being pushed to the main version of the bot
    if (in_development === false && categoriesToSkip.includes(category)) continue;

    const commandFiles = fs.readdirSync(`${__basedir}/commands/${category}`)
        .filter(commandFile => commandFile.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const command = require(`${__basedir}/commands/${category}/${commandFile}`);
        command.category = category;
        
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "9" }).setToken(token);

if (in_development === true) {
    rest.put(Routes.applicationGuildCommands(bot_id, dev_server_id), { body: commands })
        .then(() => log("Registered application commands in the development server."));
} else {
    rest.put(Routes.applicationCommands(bot_id), { body: commands })
        .then(() => log("Registered application commands globally."));
}

