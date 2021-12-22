const fs = require("fs");
const Discord = new require("discord.js");
const request = require("request");
const levenshtein = require("js-levenshtein");
const Sequelize = require('sequelize');
const regex = /^[0-9]+$/;


const {
    Users,
    CurrencyShop
} = require('./dbObjects');
const {
    Op
} = require('sequelize');
const currency = new Discord.Collection();
const PREFIX = '!';

const config = require("./config.json");
const defaultServerConfig = require("./default_server_config.json");



const client = new Discord.Client();
client.commands = new Discord.Collection();
client.backgroundTasks = new Discord.Collection();
client.serverConfig = new Discord.Collection();

const commandFiles = fs.readdirSync("./command_list").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./command_list/${file}`);
    client.commands.set(command.name, command);
}

const backgroundTasksFiles = fs.readdirSync("./background_tasks").filter(file => file.endsWith(".js"));
for (const file of backgroundTasksFiles) {
    const backgroundTask = require(`./background_tasks/${file}`);
    client.backgroundTasks.set(backgroundTask.name, backgroundTask);
}

const serverConfigJSON = require("./server_config.json");
const {
    MessageEmbed,
    MessageReaction,
    Message
} = require("discord.js");
const UserItems = require("./models/UserItems");
for (const guildId in serverConfigJSON) {
    client.serverConfig.set(guildId, serverConfigJSON[guildId]);
}


function getCommandObjectByName(commandName) {
    for (const commandObj of client.commands.array()) {
        if ((typeof commandObj.name === "string" && commandObj.name === commandName) || (typeof commandObj.name === "object" && commandObj.name.includes(commandName))) {
            return commandObj;
        }
    }
    return undefined;
}

function dice() {
    return Math.floor(Math.random() * 7);
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
}


function collectionToJSON(collection) {
    let result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}


client.login(config.bot_token)
    // add server configs
    .then(addServerConfigs);
client.on("guildCreate", addServerConfigs);

// start the background tasks once
for (const backgroundTaskObj of client.backgroundTasks.array()) {
    doBackgroundTask(backgroundTaskObj, client);
}


Reflect.defineProperty(currency, 'add', {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        const user = currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({
            user_id: id,
            balance: amount
        });
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});



client.once("ready", async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    client.user.setActivity("with dead people | _help");
    console.log("Ready and logged in as " + client.user.tag + "!");
    console.log("\u0007"); // bell sound
});



//DELETE LATER

client.on('message', async message => {
    if (message.author.bot) return;
    currency.add(message.author.id, 1);

    if (!message.content.startsWith(PREFIX)) return;
    const input = message.content.slice(PREFIX.length).trim();
    if (!input.length) return;
    const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

    if (command === 'balance') {

        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);

    } else if (command === 'inventory') {

        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({
            where: {
                user_id: target.id
            }
        });
        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);

    } else if (command === 'transfer') {

        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);

    } else if (command === 'buy') {

        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: commandArgs
                }
            }
        });

        if (!item) return message.channel.send('That item doesn\'t exist.');

        if (item.cost > currency.getBalance(message.author.id)) {

            return message.channel.send(`You don't have enough currency, ${message.author.username}`);
        }

        message.reply(`You bought ${item.name}`)
        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);


    } else if (command === 'shop') {

        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'), {
            code: true
        });

    } else if (command === 'leaderboard') {

        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
            .filter(user => client.users.cache.has(user.user_id))
            .first(10)
            .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
            .join('\n'), {
                code: true
            },
        );
    } else if (command === 'gamble') {

        message.channel.send('Would you like to enter the casino? (cost: 100)').then(() => {

                const filter = m => message.author.id === m.author.id;
                message.channel.awaitMessages(filter, {
                        time: 600000,
                        max: 1,
                        errors: ['time']
                    })

                    .then(messages => {
                        if (messages.first().content.toLowerCase() === 'yes') {

                            if (100 > currency.getBalance(message.author.id)) {

                                return message.reply(`It seems that you do not have the funds required to enter the casino. What a shame.`);
                            } else {

                                currency.add(message.author.id, -1);
                                const {
                                    MessageEmbed
                                } = require('discord.js');
                                const embed = new MessageEmbed()
                                    .setAuthor(`${message.author.username}`, message.author.avatarURL())
                                    .addField("HOL", "Guess if the number im thinking of is higher of lower, range determines money earned.")
                                    .addField("Blackjack", "Player aims to get a number as close to 21 as possible, then plays against the dealer.")
                                    .addField("Dice", "The computer and player both roll dice, the person who rolls more, wins the bet.")
                                    .setColor("ORANGE")
                                    .setFooter("Maximum bets on all games is the money you have on your account. (!balance)")

                                message.reply("Welcome to the casino dear guest! We request that you be on your best behavior, this is a very strict establishment. Here are our available games. If you'd like more information on a game, please type !help {game}. \n If you'd like to select a game, please type !{gamename}")
                                message.channel.send(embed).then(() => {


                                    const filter = m => message.author.id === m.author.id;
                                    message.channel.awaitMessages(filter, {
                                            time: 60000,
                                            max: 1,
                                            errors: ['time']
                                        })

                                        .then(messages => {
                                            if (messages.first().content.toLowerCase() === "dice") {

                                                message.channel.send("🎲Roll of the dice it is! We will both roll a 6 sided die, the person who rolls the higher number wins! Very simple.🎲")
                                                message.channel.send(`🎲How much are you willing to bet? You currently have: ${currency.getBalance(message.author.id)}💰. (Please enter a number.)🎲`).then(() => {

                                                    var filter = m => message.author.id === m.author.id;
                                                    message.channel.awaitMessages(filter, {
                                                            time: 60000,
                                                            max: 1,
                                                            errors: ['time']
                                                        })

                                                        .then(async messages => {
                                                            var userBet = messages.first().content


                                                            if (!userBet.match(regex)) {
                                                                var userBet = 0
                                                                await message.channel.send("It seems that the input you have given is not a number. Please try again.")
                                                                await message.channel.send(`Maximum allowed bet is your balance.`).then(() => {

                                                                    var filter = m => message.author.id === m.author.id;
                                                                    message.channel.awaitMessages(filter, {
                                                                            time: 60000,
                                                                            max: 1,
                                                                            errors: ['time']
                                                                        })

                                                                        .then(async messages => {
                                                                            var userBet = messages.first().content

                                                                            if (!userBet.match(regex)) {
                                                                                return message.channel.send("What in the world? How did you manage that lol (The casino's manager kicked you out.)")
                                                                            } else if (userBet.match(regex)) {
                                                                                return message.channel.send("TEST1")
                                                                            } else {
                                                                                return message.channel.send("what?")
                                                                            }
                                                                        }).catch(() => {
                                                                            message.channel.send("testpart3")
                                                                        })

                                                                })
                                                            }


                                                            //State users bet, if bet is higher than balance, return.
                                                            message.channel.send(`Your bet is now: ${userBet}💰`)

                                                            if (userBet > currency.getBalance(message.author.id)) {

                                                                message.channel.send(`Oh my! It seems you have bet a higher amount than your balance, that just won't do. Here's your last chance to type a correct number, or the manager will kick you out!`).then(() => {

                                                                    var filter = m => message.author.id === m.author.id;
                                                                    message.channel.awaitMessages(filter, {
                                                                            time: 60000,
                                                                            max: 1,
                                                                            errors: ['time']
                                                                        })

                                                                        .then(messages => {
                                                                            var userBet = Number(messages.first().content)

                                                                            if (userBet > currency.getBalance(message.author.id)) {
                                                                                return message.reply("I told you this would happen! (You were kicked out of the casino.")
                                                                            }

                                                                        })
                                                                })

                                                            } else {

                                                                currency.add(message.author.id, -userBet);

                                                                const diceRollComputer = dice()
                                                                const diceRollUser = dice()

                                                                const embed = new MessageEmbed()
                                                                    .setColor('ORANGE')
                                                                    .setTitle('Roll of the dice!')
                                                                    .setURL('https://www.youtube.com/watch?v=RvBwypGUkPo')
                                                                    .setAuthor("Satan's casino.", 'https://static.vecteezy.com/system/resources/previews/001/194/117/non_2x/cross-png.png', 'https://pornhub.com')
                                                                    .setDescription(`Your bet was ${userBet}`)
                                                                    .setThumbnail('https://images.emojiterra.com/google/noto-emoji/v2.028/128px/1f4b8.png')
                                                                    .addFields({
                                                                        name: '🎲Roll the dice!🎲',
                                                                        value: `6 sided die.`
                                                                    }, {
                                                                        name: '\u200B',
                                                                        value: '\u200B'
                                                                    }, {
                                                                        name: `The computer rolled!🎲`,
                                                                        value: diceRollComputer,
                                                                        inline: true
                                                                    }, {
                                                                        name: 'You rolled!🎲',
                                                                        value: diceRollUser,
                                                                        inline: true
                                                                    }, )
                                                                    .setTimestamp()
                                                                    .setFooter('Provided by corpse#4655');

                                                                message.reply(embed);

                                                                if (diceRollComputer > diceRollUser) {
                                                                    message.channel.send(`It seems you have lost the game. (You lost ${userBet}💰)`);
                                                                } else if (diceRollUser > diceRollComputer) {

                                                                    let userProfit = userBet * 2
                                                                    message.channel.send(`Congratulations! You won: ${userProfit}💰 (Your bet x2)`);

                                                                    currency.add(message.author.id, userProfit);
                                                                } else if (diceRollComputer === diceRollUser) {

                                                                    currency.add(message.author.id, userBet);
                                                                    return message.channel.send(`Its.. a draw?\nYou got back ${userBet}💰`);
                                                                } else {
                                                                    message.channel.send("Im.. not quite sure what happened. My apologies, here's your money back, plus some extra for the inconvenience.");
                                                                    currency.add(message, author.id, userBet + 1000)
                                                                }

                                                            }
                                                        })
                                                })
                                            }

                                        })

                                })
                            }
                        } else {
                            message.channel.send("Alright, come back another time!")
                            return message.reply("Psst. Type the word yes to accept the offer next time!")
                        }
                    })
            })
            .catch(() => {
                message.channel.send('Hey, did you fall asleep? (Time ran out.) 1');
            });

    } else if (command === 'givemoney') {
        currency.add(message.author.id, 1000);

    }




});




//Deleted message logging
client.on("messageDelete", message => {
    const embed = new MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.avatarURL())
        .setDescription(message.content)

    const channel = client.channels.cache.get("825726316817023016")
    channel.send(embed)
})
//For handling commands
client.on("message", message => {
    // disable DMs
    if (message.guild === null) return;

    // log messages
    const date = new Date(message.createdTimestamp);
    console.log(date.toGMTString() + " | " + message.guild.name + " | " + "#" + message.channel.name + " | " + message.author.tag + ": " + message.content, message.type);

    const prefix = client.serverConfig.get(message.guild.id).prefix;

    // don't do commands if they come from a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //Disable lines below for public use, otherwise user needs to be administrator
    //if (!message.guild.member(message.author).hasPermission(['ADMINISTRATOR'])) {
    //  return message.channel.send("you do not withold the powers to use the kek bot... try again later! L");
    //}

    const args = message.content.slice(prefix.length).replace(/\s+/, " ").trim().split(" ");
    let command = args.shift();

    const commandObject = getCommandObjectByName(command);
    if (commandObject === undefined) { // if the command doesn't exist
        // turn sub arrays into larger array (since some commands have multiple names in an array)
        let allCommands = []; // list of all command names (including aliases)
        for (const commandObj of client.commands.array()) {
            if (typeof commandObj.name === "object") {
                for (const commandAlias of commandObj.name) {
                    allCommands.push(commandAlias);
                }
            } else {
                allCommands.push(commandObj.name);
            }
        }

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