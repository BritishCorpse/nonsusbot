// inspired by https://github.com/IanMitchell/jest-discord

const Discord = require("discord.js");
const fs = require("fs");
const cp = require("child_process");
const { fuzz, preset } = require("fuzzing");

const sleep = require("util").promisify(setTimeout);

const developmentConfig = require("../development_config.json");


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGES,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});

// Start the main bot process
let mainBotProcess;
let mainBotClient;


function startMainBot() {
    return new Promise((resolve, reject) => {
        mainBotProcess = cp.fork("./index.js");

        mainBotProcess.on("message", async message => {
            mainBotClient = JSON.parse(message);
            await sleep(100);
            resolve();
        });
    });
}


beforeAll(() => {
    return startMainBot();
}, 20 * 1000);

// Restart the bot whenever it crashes
afterEach(() => {
    if (mainBotProcess.exitCode !== null) {
        return startMainBot();
    }
});

// Login the bot and create test channel
let testGuild;
let testChannel;
beforeAll(() => {
    jest.setTimeout(20 * 1000);

    // Create custom functions accessible from tests to send commands and get response
    client.prompt = (channel, message, timeout=10000) => {
        return new Promise(resolve => {
            channel.send(message)
            .then(() => {
                const filter = m => m.author.id === mainBotClient.user;
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

    // Login the bot
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
                topic: "A temporary channel to test bot commands",
                permissionOverwrites: [
                    /*{
                        // overwrite permissions for the main bot just in case
                        id: developmentConfig.main_bot_discord_user_id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES",
                                "ATTACH_FILES", "ADD_REACTIONS"]
                    },*/
                    {
                        // overwrite permissions for everyone else
                        id: testGuild.roles.everyone.id,
                        deny: ["SEND_MESSAGES", "ADD_REACTIONS", "MANAGE_MESSAGES"]
                    }
                ]
            });
            resolve();
        });
    });
}, 20 * 1000);

// Delete the test channel
afterAll(() => {
    return new Promise(async (resolve, reject) => {
        //await testChannel.delete("Test complete");
        mainBotProcess.kill();
        resolve();
    });
});

// Tests
describe("mention", () => {
    describe("without extra text", () => {
        let response;
        beforeAll(async () => {
            response = await client.prompt(testChannel, `<@!${mainBotClient.user}>`);
        });

        it("has the word prefix in content", () => {
            expect(response.content)
            .toInclude("prefix");
        });
        
        it("has the prefix in content", () => {
            const prefix = require('../server_config.json')[testChannel.guild.id].prefix;
            expect(response.content)
            .toInclude(prefix);
        });
    });
});

const categories = fs.readdirSync("./command_list");
const commands = [];
for (const category of categories) {
    const commandFiles = fs.readdirSync(`./command_list/${category}`);

    for (const commandFile of commandFiles) {
        const data = fs.readFileSync(`./command_list/${category}/${commandFile}`, "utf8");
        const name = JSON.parse(data.match(/name: *((?:"|'|\[).+),/)[1].replace(/'/g, "\""));

        if (typeof name === "object") {
            for (const alias of name) {
                commands.push(alias);
            }
        } else if (typeof name === "string") {
            commands.push(name);
        }
    }
}

describe("fuzzing arguments", () => {
    for (const command of commands) {
        describe(`${command} command`, () => {
            const p = (...args) => {
                const textArgs = args.map(arg => arg.toString()).join(" ");
                describe(`fuzz: ${textArgs}`, () => {
                    let response;
                    beforeAll(async () => {
                        response = await client.promptCommand(testChannel, `${command} ${textArgs}`);
                    });

                    it("does not crash", () => {
                        expect(response)
                        .toBeTruthy();
                    });
                });
            };

            // TODO: make fuzz not stupid and exponentially use memory
            fuzz(p).all();
            //fuzz(p).under(preset.all(), preset.all());
        });
    }
});
