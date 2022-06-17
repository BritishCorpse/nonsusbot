// Set the base directory to remove relative paths.
global.__basedir = __dirname;

// Set the time the bot started for calculating uptime.
global.startTimestamp = new Date();

const fs = require("node:fs");

const { Client, Intents, Collection } = require("discord.js");
const { log } = require("./utilities/botLogFunctions");
const { token } = require(`${__basedir}/configs/graveyard_config.json`);
const graveyard = new Client({ intents: 
    [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ], allowedMentions: { parse: ["users", "roles"] }

});

//
//! Functions that are required in this file
//

const { sendError } = require(`${__basedir}/utilities/sendError.js`);

const { getCommandCategories } = require(`${__basedir}/utilities/commandFunctions.js`);

const { addNewGuildServerConfigs  } = require(`${__basedir}/utilities/configFunctions.js`);

//
//! Collections
//  

graveyard.serverConfig = new Collection();
graveyard.commands = new Collection();
graveyard.backgroundProcesses = new Collection();
graveyard.achievements = new Collection();

//
//! Currency system methods
//

//
//! Commands
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
//! Achievements
//


//
//! Server configuration
//

let serverConfigJSON;
try {
    serverConfigJSON = require(`${__basedir}/server_config.json`);
} catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
        serverConfigJSON = {};
    }
}
for (const guildId in serverConfigJSON) {
    graveyard.serverConfig.set(guildId, serverConfigJSON[guildId]);
}


//
//! Login to discord and update server configurations
//

graveyard.login(token);

graveyard.on("guildCreate", async () => {  });

graveyard.once("ready", async () => {
    await addNewGuildServerConfigs(graveyard);
    log("Updated guild server configs.");

    log("Initiated new bot instance.");
});

//
//! Background tasks
//

//* add all processfiles to the collection
const processFiles = fs.readdirSync(`${__basedir}/events`).filter(processFile => processFile.endsWith(".js"));

for (const processFile of processFiles) {
    const backgroundProcess = require(`${__basedir}/events/${processFile}`);
    graveyard.backgroundProcesses.set(backgroundProcess.name, backgroundProcess);
}

//* start each background process once
graveyard.backgroundProcesses.forEach(backgroundProcess => {
    backgroundProcess.execute(graveyard);
});

//
//! Error handling
//

// (i know its advanced, but try your best to understand)
process.on("unhandledRejection", async error => {
    // if (error.type === "DiscordApiError" && error.message === "Missing Access") return;

    const { development } = require(`${__basedir}/configs/graveyard_config.json`);
    
    //* if we are currently in development, log the entire error
    if (development === true) console.log(error);

    await sendError(error);
});


//
//! Command execution
//

//* command execution has moved to ./events/commandInteractionCreate.js