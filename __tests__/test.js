// inspired by https://github.com/IanMitchell/jest-discord


const Discord = require("discord.js");

const developmentConfig = require("../development_config.json");


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});

// Create custom functions accessible from tests to send commands and get response
client.prompt = (channel, message, timeout=10000) => {
    return new Promise(resolve => {
        channel.send(message)
        .then(() => {
            const filter = m => m;
            channel.awaitMessages({
                filter,
                max: 1,
                time: timeout,
                errors: ['time']
            })
            .then(messages => resolve(messages.first()));
        });
    });
};



test("login bot", async () => {
    await client.login(developmentConfig.testing_bot_token);
    
    client.once("ready", () => {
        client.user.setActivity("testing the Graveyard bot");
        console.log("Testing bot ready and logged in as " + client.user.tag + "!");
        console.log("\u0007"); // bell sound

        expect(client.isReady())
        .toBe(true);
    });
});
