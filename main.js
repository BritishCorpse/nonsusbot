const {token} = require("./sources/botConfigs.json");
const {Client, GatewayIntentBits, Collection} = require("discord.js");

const mongoose = require("mongoose");

global.__basedir = __dirname;

const fs = require("fs");

// Function used to format logging.
global.log = function (log) {
    const date = new Date();

    console.log(`${date.toUTCString()}: ${log}`);
};

// Create a new client instance
const client = new Client({
    intents:
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
    ], allowedMentions: {parse: ["users", "roles"]},

});

// Login
client.login(token);

// Once the client has logged in.
client.once("ready", async () => {
    log("Started new bot instance.");

    // connect to the database
    // ignore the super secret password. it doesn't really matter since no outside devices should be allowed to connect in to the databse since the port is not forwarded.
    await mongoose.connect("mongodb://admin:myadminpassword@192.168.1.115", {keepAlive: true});

    log("Connected to Mongo database.");
});

// Collections
client.eventListeners = new Collection();
client.commands = new Collection();

// Run startup files
const startupFiles = fs.readdirSync("./startupFiles").filter(file => file.endsWith(".js"));

for (const startupFile of startupFiles) {
    const file = require(`./startupFiles/${startupFile}`);

    file.execute(client);
}

// Start event listeners
const eventListenerFiles = fs.readdirSync("./eventListeners").filter(file => file.endsWith(".js"));

for (const listenerFile of eventListenerFiles) {
    const eventListener = require(`./eventListeners/${listenerFile}`);

    client.eventListeners.set(eventListener.name, eventListener);
}

client.eventListeners.forEach(eventListener => {
    eventListener.execute(client);
});

log("Event listeners started.");
