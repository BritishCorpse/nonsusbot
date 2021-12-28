// inspired by https://github.com/IanMitchell/jest-discord

const Discord = require("discord.js");

const developmentConfig = require('./development_config.json');


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});

client.prompt = (channel, message, timeout=10000) => {
    
};

client.login(developmentConfig.testing_bot_token);

client.once("ready", async () => {
    client.user.setActivity("testing the Graveyard bot");
    console.log("Testing bot ready and logged in as " + client.user.tag + "!");
    console.log("\u0007"); // bell sound

    const guild = client.guilds.cache.get(developmentConfig.testing_discord_server_id);
    console.log(guild);
});


