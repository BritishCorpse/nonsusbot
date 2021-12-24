const fs = require("fs");
const Discord = new require("discord.js");
const request = require("request");
const levenshtein = require("js-levenshtein");
//const Sequelize = require('sequelize');
//const { Op } = require('sequelize');

// Remove this once not needed anymore:
const {
    MessageEmbed
} = require("discord.js");

const {
    Users,
    CurrencyShop
} = require('./dbObjects');

const config = require("./config.json");
const defaultServerConfig = require("./default_server_config.json");


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

const commandFiles = fs.readdirSync("./command_list")
    .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./command_list/${file}`);
    client.commands.set(command.name, command);
}

const backgroundTasksFiles = fs.readdirSync("./background_tasks")
    .filter(file => file.endsWith(".js"));
for (const file of backgroundTasksFiles) {
    const backgroundTask = require(`./background_tasks/${file}`);
    client.backgroundTasks.set(backgroundTask.name, backgroundTask);
}

const serverConfigJSON = require("./server_config.json");
for (const guildId in serverConfigJSON) {
    client.serverConfig.set(guildId, serverConfigJSON[guildId]);
}


function getCommandObjectByName(commandName) {
    let returnValue;
    client.commands.forEach(commandObj => {
        if ((typeof commandObj.name === "string" && commandObj.name === commandName) || (typeof commandObj.name === "object" && commandObj.name.includes(commandName))) {
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


function doBackgroundTask(backgroundTaskObj, client) {
    backgroundTaskObj.execute(client);
}


function addServerConfigs() {
    // add new guilds to the server_config.json file
    client.guilds.cache.each(guild => {
        let serverConfigJSON = {};
        if (client.serverConfig.get(guild.id) === undefined) {
            client.serverConfig.set(guild.id, defaultServerConfig);
            serverConfigJSON[guild.id] = defaultServerConfig;
        }
        fs.writeFileSync("./server_config.json", JSON.stringify(serverConfigJSON));
    });
};


function collectionToJSON(collection) {
    let result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
};


client.login(config.bot_token)
    // add server configs
    .then(addServerConfigs);
client.on("guildCreate", addServerConfigs);


// start the background tasks once
client.backgroundTasks.forEach(backgroundTaskObj => {
    doBackgroundTask(backgroundTaskObj, client);
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
    client.user.setActivity("with dead people | _help");
    console.log("Ready and logged in as " + client.user.tag + "!");
    console.log("\u0007"); // bell sound
});


// Deleted message logging (MOVE THIS TO BACKGROUND TASKS??)
client.on("messageDelete", message => {
    const embed = new MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.avatarURL())
        .setDescription(message.content);

    const channel = client.channels.cache.get("825726316817023016");
    channel.send({
        embeds: [embed]
    });
});


//For handling commands
client.on("messageCreate", message => {
    // disable DMs
    if (message.guild === null) return;

    // log messages
    const date = new Date(message.createdTimestamp);
    console.log(`${date.toGMTString()} | ${message.guild.name} | #${message.channel.name} | ${message.author.tag}: ${message.content} ${message.type}`);

    const prefix = client.serverConfig.get(message.guild.id).prefix;

    // don't do commands if they come from a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //Disable lines below for public use, otherwise user needs to be administrator
    //if (!message.guild.member(message.author).hasPermission(['ADMINISTRATOR'])) {
    //  return message.channel.send("you do not withold the powers to use the kek bot... try again later! L");
    //}

    const args = message.content.slice(prefix.length)
        .replace(/\s+/, " ")
        .trim()
        .split(" ");
    let command = args.shift();

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
        console.log(allCommands);

        let topCommands = []; // list of top command matches

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

    //console.log(commandObject);
    if (commandObject.op !== true) {
        doCommand(commandObject, message, args);
    } else {
        message.channel.send("Admin only commands are currently disabled.")
    }
});
