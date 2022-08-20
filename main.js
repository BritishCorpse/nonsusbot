global.__basedir = __dirname;

const { token } = require(`${__basedir}/sources/botConfigs.json`);
const {
    username: dbUsername,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
} = require(`${__basedir}/sources/databaseConfigs.json`);
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const mongoose = require("mongoose");

const fs = require("fs");

// Require globalUtilities folder used for sub processes.
const globalUtilitiesFolder = require(`${__basedir}/globalUtilities`);

// Function used to format and log information to the console.
global.log = function (logText) {
    const date = new Date();

    console.log(`${date.toUTCString()}: ${logText}`);
};

// Create a new client instance
const client = new Client({
    intents:
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ], allowedMentions: { parse: ["users", "roles"] },

});

// Login
client.login(token);

// Once the client has logged in.
client.once("ready", () => {
    log("Started new bot instance.");
});

// Connect to the database (the order of the assignments to dbUrl matter)
const dbUrl = new URL("mongodb://");

dbUrl.host = dbHost;
dbUrl.port = dbPort;
dbUrl.pathname = dbDatabase;
dbUrl.username = dbUsername;
dbUrl.password = dbPassword;

mongoose.connect(dbUrl.href, { keepAlive: true })
    .then(() => {
        log("Connected to Mongo database.");
    });

// Collections
client.commands = new Collection();

client.processes = [];

// Run startup files
const startupFiles = fs.readdirSync("./startupFiles").filter(file => file.endsWith(".js"));

for (const startupFile of startupFiles) {
    const file = require(`./startupFiles/${startupFile}`);

    file.execute(client);
}

// Start event listeners
const eventListenerFiles = fs.readdirSync("./processEventListeners").filter(file => file.endsWith(".js"));

for (const listenerFile of eventListenerFiles) {
    const eventListener = require(`./processEventListeners/${listenerFile}`);

    eventListener.execute(client, globalUtilitiesFolder);
}

log("Event listeners started.");

// Log all processes.
const { ProcessManager } = globalUtilitiesFolder;

const processManager = new ProcessManager();

processManager.listProcesses(client);
