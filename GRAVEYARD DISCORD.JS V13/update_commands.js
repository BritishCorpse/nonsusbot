const fs = require("node:fs");
const path = require("node:path");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { graveyardID, devServerID, token, development } = require("./graveyard_config.json");

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    commands.push(command.data.toJSON());
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

