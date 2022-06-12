// Set the base directory to remove relative paths.
global.__basedir = __dirname;

// Set the time the bot started for calculating uptime.
global.startTimestamp = new Date();

const fs = require("node:fs");

const { Client, Intents, Collection } = require("discord.js");
const { userFinance } = require("./db_objects");
const { token } = require(`${__basedir}/configs/graveyard_config.json`);
const graveyard = new Client({ intents: 
    [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ], allowedMentions: { parse: ["users", "roles"] }
});

//
//! Functions that are required in this file
//

const { 
    formatBacktick,
} = require(`${__basedir}/utilities/generalFunctions.js`);

const {
    getCommandCategories
} = require(`${__basedir}/utilities/commandFunctions.js`);

//
//! Collections
//  

graveyard.backgroundProcesses = new Collection();
graveyard.serverConfig = new Collection();
graveyard.commands = new Collection();
graveyard.backgroundProcesses = new Collection();
graveyard.currency = new Collection();
graveyard.achievements = new Collection();

//
//! Currency system methods
//

Reflect.defineProperty(graveyard.currency, "add", {
    value: async (id, amount) => {
        const user = graveyard.currency.get(id);

        if (user) {
            user.balance += Number(amount);
            return user.save();
        }

        const newUser = await userFinance.create({ userId: id, balance: amount });
        graveyard.currency.set(id, newUser);

        return newUser;
    },
});

Reflect.defineProperty(graveyard.currency, "getBalance", {
    value: id => {
        const user = graveyard.currency.get(id);
        return user ? user.balance : 0;
    },
});

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

const achievementList = require(`${__basedir}/configs/achievements`);

let 

//
//! Server configuration
//

const defaultServerConfig = require(`${__basedir}/configs/default_server_config.json`);
const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions.js`);

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
//! Login to discord and update server configurations
//

graveyard.login(token);

graveyard.on("guildCreate", async () => { await addNewGuildServerConfigs(); });

graveyard.once("ready", async () => {
    await addNewGuildServerConfigs();

    console.log(`Initiated new bot instance at ${new Date().toUTCString()}`);
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
//! Command execution
//

graveyard.on("interactionCreate", async interaction => {
    //* make sure the interaction is a command, because this only handles commands
    if (!interaction.isCommand()) return;

    //* finds the command in the collection
    // returns if the command is not found
    const command = graveyard.commands.get(interaction.commandName);
    if (!command) return;

    //* check if member is a verified developer
    // if the user is not a developer, just return

    //* check member permissions
    // if the member is missing permissions, tell them what permissions theyre missing and end the execution
    if (!interaction.member.permissionsIn(interaction.channel).has(command.requiredUserPermissions || [])) {
        const missingPermissions = [];
        for (const permission of command.requiredUserPermissions) {
            if (!interaction.member.permissionsIn(interaction.channel).has(permission)) {
                missingPermissions.push(permission);
            }
        }

        await interaction.reply(`You do not have these required permissions in this channel or server: ${missingPermissions.map(formatBacktick).join(", ")}`);
        return;
    }

    //* check for bot permissions
    // if im missing permissions, tell them what permissions im missing and end the execution
    if (!interaction.guild.me.permissionsIn(interaction.channel).has((command.requiredBotPermissions || []))) {
        const missingPermissions = [];
        for (const permission of command.requiredBotPermissions) {
            if (!interaction.guild.me.permissionsIn(interaction.channel).has(permission)) {
                missingPermissions.push(permission);
            }
        }

        await interaction.reply(`I do not have these required permissions in this channel or server: ${missingPermissions.map(formatBacktick).join(", ")}`);
        return;
    }

    //* execute the command
    // if command execution fails, log the error and send them an ephemeral reply stating to go contact support.
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "An error occured. If this error persists, please contact support at https://talloween.github.io/graveyardbot/contact.html", ephemeral: true });
    }
});