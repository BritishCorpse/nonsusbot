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
            const filter = m => m.author.id !== client.user.id;
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

client.promptCommand = (channel, command, timeout) => {
    // get the newest prefix
    const prefix = require('../server_config.json')[channel.guild.id].prefix;

    return client.prompt(channel, prefix + command, timeout);
};

let testGuild;
let testChannel;
// Login the bot and create test channel
beforeAll(() => {
    client.login(developmentConfig.testing_bot_token);

    return new Promise((resolve, reject) => {
        client.once("ready", async () => {
            client.user.setActivity("testing the Graveyard bot");
            //console.log("Testing bot ready and logged in as " + client.user.tag + "!");
            //console.log("\u0007"); // bell sound

            testGuild = client.guilds.cache.get(developmentConfig.testing_discord_server_id);
            if (testGuild === undefined) reject();
            testChannel = await testGuild.channels.create(`test-commands-${new Date().getTime()}`, {
                type: "GUILD_TEXT",
                reason: "Test bot commands",
                topic: "A temporary channel to test bot commands"
            });
            resolve();
        });
    });
}, 10 * 1000);


// Delete the test channel
afterAll(() => {
    return new Promise(async (resolve, reject) => {
        await channel.delete("Test complete");
        resolve();
    });
});

// Tests
test("mention for prefix", async () => {
    const response = await client.prompt(testChannel, `<@!${developmentConfig.development_bot_discord_user_id}>`);
    console.log(response);
    expect(response.content)
    .toBeTruthy();
});
