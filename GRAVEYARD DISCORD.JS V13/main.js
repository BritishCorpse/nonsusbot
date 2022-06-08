// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("node:fs");

const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./graveyard_config.json");
const graveyard = new Client({ intents: [Intents.FLAGS.GUILDS] });

//
// Functions that are required in this file
//

const { 
    formatBacktick,
} = require(`${__basedir}/utilities/generalFunctions.js`);

const {
    getCommandCategories
} = require(`${__basedir}/utilities/commandFunctions.js`);

//
// Collections
//  

graveyard.backgroundTasks = new Collection();
graveyard.serverConfig = new Collection();
graveyard.commands = new Collection();

//
// Commands
//

// Load commands from the command_list folder
const categoryFolders = getCommandCategories();
for (const category of categoryFolders) {
    const commandFiles = fs.readdirSync(`${__basedir}/commands/${category}`)
        .filter(commandFile => commandFile.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const command = require(`${__basedir}/commands/${category}/${commandFile}`);
        command.category = category;
        graveyard.commands.set(command.data.name, command);
    }
}

//
// Server configuration
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

    if (!interaction.member.permissionsIn(interaction.channel).has(command.permissions || [])) {
        const missingPermissions = [];
        for (const permission of command.permissions) {
            if (!interaction.member.permissionsIn(interaction.channel).has(permission)) {
                missingPermissions.push(permission);
            }
        }

        await interaction.reply(`You do not have these required permissions in this channel or server: ${missingPermissions.map(formatBacktick).join(", ")}`);
        return;
    }

    const command = graveyard.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "An error occured. Please contact support at https://talloween.github.io/graveyardbot/contact.html", ephemeral: true });
    }
});