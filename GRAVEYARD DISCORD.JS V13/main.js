// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("node:fs");
const path = require("node:path");

const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./graveyard_config.json");
const graveyard = new Client({ intents: [Intents.FLAGS.GUILDS] });

// cool collections
graveyard.backgroundTasks = new Collection();
graveyard.serverConfig = new Collection();
graveyard.commands = new Collection();

//
// Command stuff
//

//declare the commandfiles path and find all the files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

//loop through all the files and add it to the collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    graveyard.commands.set(command.data.name, command);
}

//
// Here's all the server config stuff
//
const defaultServerConfig = require("./default_server_config.json");
const { saveServerConfig } = require("./utilities/configFunctions.js");

let serverConfigJSON;
try {
    serverConfigJSON = require("./server_config.json");
} catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
        serverConfigJSON = {};
    }
}
for (const guildId in serverConfigJSON) {
    graveyard.serverConfig.set(guildId, serverConfigJSON[guildId]);
}

async function addNewGuildServerConfigs() {
    // add new guilds to the server_config.json file
    const guilds = await graveyard.guilds.fetch();

    guilds.each(guild => {
        if (graveyard.serverConfig.get(guild.id) === undefined) {
            // JSON.parse JSON.stringify makes a deep copy, which is needed to fix a bug where editing one config edits multiple configs because they are the same object
            graveyard.serverConfig.set(guild.id, JSON.parse(JSON.stringify(defaultServerConfig))); 
        }
    });
    // save it to the server_config.json file
    await saveServerConfig(graveyard.serverConfig);


}

//
// Login to discord and update server configurations
//
graveyard.login(token);

graveyard.on("guildCreate", async () => { await addNewGuildServerConfigs(); });

graveyard.once("ready", async () => {
    await addNewGuildServerConfigs();

    console.log(`Initiated new bot instance at ${new Date().toUTCString()}`);
});

//
// Command execution
//

graveyard.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = graveyard.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "An error occured. Please contact support at https://talloween.github.io/graveyardbot/", ephemeral: true });
    }
});