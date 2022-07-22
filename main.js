const { token } = require("./sources/botConfigs.json");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

global.__basedir = __dirname;

const fs = require("fs");

// Function used to format logging.
const log = function(log) {
    const date = new Date();

    console.log(`${date.toUTCString()}: ${log}`);
};

// Create a new client instance
const client = new Client({ intents: 
    [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
    ], allowedMentions: { parse: ["users", "roles"] }

});

// Login
client.login(token);

// Once the client has logged in.
client.once("ready", async () => {
    log("Started new bot instance.");
});

// Collections
client.eventListeners = new Collection();
client.commands = new Collection();

// Start event listeners
const eventListenerFiles = fs.readdirSync("./eventListeners").filter(file => file.endsWith(".js"));

for (const listenerFile of eventListenerFiles) {
    const eventListener = require(`./eventListeners/${listenerFile}`);

    client.eventListeners.set(eventListener.name, eventListener);
}

client.eventListeners.forEach(eventListener => {
    eventListener.execute(client);
});

/*
// Read commands from commands folder
// Push commands data in a JSON format to an array
const commands = [];

const commandCategories = fs.readdirSync("./commands");

for (const category of commandCategories) {
    const commandFiles = fs.readdirSync(`./commands/${category}`).filter(commandFile => commandFile.endsWith(".js"));

    for (const commandFile of commandFiles) {
        const command = require(`./commands/${category}/${commandFile}`);
        command.category = category;

        client.commands.set(command.data.name, command);

        commands.push(command.data.toJSON());
    }
}

// Deploy commands to discord
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { bot_id } = require(`${__basedir }/configs/graveyard_config.json`);

//FIX THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const { dev_server_id, in_development } = require(`${__basedir}/configs/development_config.json`);

//* loop through all the categories, and push each command in a respective category to the commands array.

const rest = new REST({ version: "9" }).setToken(token);

if (in_development === true) {
    rest.put(Routes.applicationGuildCommands(bot_id, dev_server_id), { body: commands })
        .then(() => log("Registered application commands in the development server."));
} else {
    rest.put(Routes.applicationCommands(bot_id), { body: commands })
        .then(() => log("Registered application commands globally."));
}
*/