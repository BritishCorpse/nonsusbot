// Don't run unless it was using a npm script
if (process.env.npm_command === undefined) {
    console.log('This script must be run using npm, as some features of this bot require it. See README.md for more information.');
    process.exit(1);
}

// Set the base directory to remove relative paths
global.__basedir = __dirname;

const fs = require("fs");
const Discord = new require("discord.js");
const request = require("request");
const levenshtein = require("js-levenshtein");
//const Sequelize = require('sequelize');
//const { Op } = require('sequelize');

const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);

// for common functions
const { saveServerConfig } = require(`${__basedir}/functions`);

const config = require(`${__basedir}/config.json`);
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);

const developmentConfig = require(`${__basedir}/development_config.json`);


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});

client.commands = new Discord.Collection();
client.backgroundTasks = new Discord.Collection();
client.serverConfig = new Discord.Collection();
client.currency = new Discord.Collection();

// Load commands from the command_list folder
const categoryFolders = fs.readdirSync("./command_list");
for (const category of categoryFolders) {
    const commandFiles = fs.readdirSync(`${__basedir}/command_list/${category}`)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`${__basedir}/command_list/${category}/${file}`);
        command.category = category;
        client.commands.set(command.name, command);
    }
}

// Load background tasks from the background_tasks folder
const backgroundTasksFiles = fs.readdirSync(`${__basedir}/background_tasks`)
    .filter(file => file.endsWith(".js"));
for (const file of backgroundTasksFiles) {
    const backgroundTask = require(`${__basedir}/background_tasks/${file}`);
    client.backgroundTasks.set(backgroundTask.name, backgroundTask);
}

// Load server-specific configs from the server_config.json file
let serverConfigJSON;
try {
    serverConfigJSON = require(`${__basedir}/server_config.json`);
} catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
        serverConfigJSON = {};
    }
}
for (const guildId in serverConfigJSON) {
    client.serverConfig.set(guildId, serverConfigJSON[guildId]);
}


function getCommandObjectByName(commandName) {
    let returnValue;
    client.commands.forEach(commandObj => {
        if ((typeof commandObj.name === "string"
             && commandObj.name === commandName)
            || (typeof commandObj.name === "object"
                && commandObj.name.includes(commandName))) {
            returnValue = commandObj;
            return;
        }
    });

    return returnValue;
}


function doCommand(commandObj, message, args) {
    try {
        commandObj.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command!");
    }
}


function collectionToJSON(collection) {
    // turns a discord collection to a JSON {key: value} dictionary
    let result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}


function addNewGuildServerConfigs() {
    // add new guilds to the server_config.json file
    client.guilds.cache.each(guild => {
        if (client.serverConfig.get(guild.id) === undefined) {
            // JSON.parse JSON.stringify makes a deep copy, which is needed to fix a bug where editing one config edits multiple configs because they are the same object
            client.serverConfig.set(guild.id, JSON.parse(JSON.stringify(defaultServerConfig))); 
        }
    });
    saveServerConfig(client.serverConfig);
}


client.login(config.bot_token)
    // add server configs
    .then(addNewGuildServerConfigs);
client.on("guildCreate", addNewGuildServerConfigs);


// start the background tasks once
client.backgroundTasks.forEach(backgroundTask => {
    backgroundTask.execute(client);
});


Reflect.defineProperty(client.currency, 'add', {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        const user = client.currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({
            user_id: id,
            balance: amount
        });
        client.currency.set(id, newUser);
        return newUser;
    },
});


Reflect.defineProperty(client.currency, 'getBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        const user = client.currency.get(id);
        return user ? user.balance : 0;
    },
});


client.once("ready", async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => client.currency.set(b.user_id, b));
    client.user.setActivity(`with dead people | @ me for my prefix!`);
    console.log("Ready and logged in as " + client.user.tag + "!");
    console.log("\u0007"); // bell sound
});


// For handling commands
client.on("messageCreate", async message => {
    // Disable DMs
    if (message.guild === null) return;

    // Log messages
    const date = new Date(message.createdTimestamp);
    console.log(`${date.toGMTString()} | ${message.guild.name} | #${message.channel.name} | ${message.author.tag}: ${message.content} ${message.type}`);

    const prefix = client.serverConfig.get(message.guild.id).prefix;

    // Don't do commands if they come from a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Check for user's badge. If there is no custom badge, make the normal badge.
    // Marked this out, will fix tomorrow.
/*
    const user = await Users.findOne({
        where: {
            user_id: message.member.id
        }
    });

    const item = await CurrencyShop.findOne({
        where: {
            name: {
                [Op.like]: "VIP pass" 
            }
        }
    });

    const userItems = await user.getItems();
    for (const userItem of userItems) {
        const userBadge = userItems.find(userItem => userItem.item_id == item.id);
    }

    */

    const args = message.content.slice(prefix.length)
        .replace(/\s+/, " ")
        .trim()
        .split(" ");
    const command = args.shift();

    const commandObject = getCommandObjectByName(command);
    if (commandObject === undefined) { // if the command doesn't exist
        // turn sub arrays into larger array (since some commands have multiple names in an array)
        let allCommands = []; // list of all command names (including aliases)
        client.commands.forEach(commandObj => {
            if (typeof commandObj.name === "object") {
                for (const commandAlias of commandObj.name) {
                    allCommands.push(commandAlias);
                }
            } else {
                allCommands.push(commandObj.name);
            }
        });

        const topCommands = []; // list of top command matches

        for (const commandName of allCommands) {
            const similarity = levenshtein(command, commandName);
            if (similarity < 3) {
                topCommands.push(commandName);
            }
        }

        if (topCommands.length === 0) {
            message.channel.send("Command not found. No similar command was found.");
        } else {
            message.channel.send("Command not found. Similar commands: " + topCommands.join(", "));
        }

        return;
    }

    // Check for permissions
    if (!message.member.permissionsIn(message.channel).has(commandObject.userPermissions || [])) {
        const missingPermissions = [];
        for (const permission of commandObject.userPermissions) {
            if (!message.member.permissionsIn(message.channel).has(permission)) {
                missingPermissions.push(permission);
            }
        }

        message.channel.send(`You do not have these required permissions: \`${missingPermissions.join('`, `')}\``);
        return;
    }

    // Check of developer only commands
    if (commandObject.developer) {
        if (!developmentConfig.developer_discord_user_ids.includes(message.author.id)) {
            message.channel.send("You are not a developer!");
            return;
        }

        if (!developmentConfig.development_discord_server_ids.includes(message.guild.id)) {
            message.channel.send("You are a developer, but you are not in a development server!");
            return;
        }

        //message.channel.send("Developer only commands are currently disabled.");
        //return;
    }
    
    // If all the checks passed, do the command
    doCommand(commandObject, message, args);
});
