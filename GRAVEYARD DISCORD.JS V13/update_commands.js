// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("node:fs");

const { getCommandCategories } = require("./utilities/commandFunctions.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { graveyardID, devServerID, token, development } = require("./graveyard_config.json");

const commands = [];

const categoryFolders = getCommandCategories();
for (const category of categoryFolders) {
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
        .then(() => console.log("Registered application commands. (In the development server only)"))
        .catch(console.error);
} else {
    rest.put(Routes.applicationCommands(graveyardID), { body: commands })
        .then(() => console.log("Registered application commands. (Globally. Might take up to an hour to update all guilds.)"))
        .catch(console.error);
}

