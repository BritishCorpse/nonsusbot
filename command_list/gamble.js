const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'gamble',
    category: "Currency",
    description: "Goes to the casino.",
    execute (message, args) {
        message.channel.send('Would you like to enter the casino? (cost: 100)').then(() => {

            const filter = m => message.author.id === m.author.id;
            message.channel.awaitMessages(filter, {
                time: 600000,
                max: 1,
                errors: ['time']
            })
            .then(messages => {
                if (messages.first().content.toLowerCase() === 'yes') {
                    if (100 > message.client.currency.getBalance(message.author.id)) {
                        return message.reply(`It seems that you do not have the funds required to enter the casino. What a shame.`);
                    } else {
                        message.client.currency.add(message.author.id, -1);
                        const embed = new MessageEmbed()
                            .setAuthor(`${message.author.username}`, message.author.avatarURL())
                            .addField("HOL", "Guess if the number im thinking of is higher of lower, range determines money earned.")
                            .addField("Blackjack", "Player aims to get a number as close to 21 as possible, then plays against the dealer.")
                            .addField("Dice", "The computer and player both roll dice, the person who rolls more, wins the bet.")
                            .setColor("ORANGE")
                            .setFooter("Maximum bets on all games is the money you have on your account. (!balance)");

                        message.reply("Welcome to the casino dear guest! We request that you be on your best behavior, this is a very strict establishment. Here are our available games. If you'd like more information on a game, please type !help {game}. \n If you'd like to select a game, please type !{gamename}")
                        message.channel.send({embeds: [embed]})
                        .then(() => {
                            const filter = m => message.author.id === m.author.id;
                            message.channel.awaitMessages(filter, {
                                time: 60000,
                                max: 1,
                                errors: ['time']
                            })
                            .then(messages => {
                                if (messages.first().content.toLowerCase() === "dice") {
                                    message.channel.send("🎲Roll of the dice it is! We will both roll a 6 sided die, the person who rolls the higher number wins! Very simple.🎲");
                                    message.channel.send(`🎲How much are you willing to bet? You currently have: ${message.client.currency.getBalance(message.author.id)}💰. (Please enter a number.)🎲`)
                                    .then(async () => {
                                        const filter = m => message.author.id === m.author.id;

                                        // Get user input for bet amount. Ask for it twice, then kick them out.
                                        let userBet = '';

                                        for (let i = 0; i < 2; ++i) {
                                            await message.channel.awaitMessages(filter, {
                                                time: 60000,
                                                max: 1,
                                                errors: ['time']
                                            })
                                            .then(messages => {
                                                userBet = messages.first().content;
                                            });

                                            if (!isNaN(userBet)) { // checks if userBet is a number
                                                break;
                                            }

                                            if (i === 1) {
                                                message.channel.send("You are too dumb for this. *Kicks you out of the casino.*");
                                                return;
                                            } else {
                                                message.channel.send("It seems that the input you have given is not a number. Please try again.");
                                            }
                                        }

                                        // State users bet, if bet is higher than balance, return.
                                        message.channel.send(`Your bet is now: ${userBet}💰`);

                                        if (userBet > message.client.currency.getBalance(message.author.id)) {
                                            message.channel.send(`Oh my! It seems you have bet a higher amount than your balance, that just won't do. Here's your last chance to type a correct number, or the manager will kick you out!`)
                                            .then(() => {
                                                const filter = m => message.author.id === m.author.id;
                                                message.channel.awaitMessages(filter, {
                                                    time: 60000,
                                                    max: 1,
                                                    errors: ['time']
                                                })
                                                .then(messages => {
                                                    userBet = Number(messages.first().content)

                                                    if (userBet > message.client.currency.getBalance(message.author.id)) {
                                                        return message.reply("I told you this would happen! (You were kicked out of the casino.")
                                                    }

                                                })
                                            })

                                        } else {
                                            message.client.currency.add(message.author.id, -userBet);

                                            const roll = () => Math.floor(Math.random() * 7)
                                            const diceRollComputer = roll();
                                            const diceRollUser = roll();

                                            const embed = new MessageEmbed()
                                                .setColor('ORANGE')
                                                .setTitle('Roll of the dice!')
                                                .setURL('https://www.youtube.com/watch?v=RvBwypGUkPo')
                                                .setAuthor("Satan's casino.", 'https://static.vecteezy.com/system/resources/previews/001/194/117/non_2x/cross-png.png', 'https://pornhub.com')
                                                .setDescription(`Your bet was ${userBet}`)
                                                .setThumbnail('https://images.emojiterra.com/google/noto-emoji/v2.028/128px/1f4b8.png')
                                                .addFields(
                                                    {name: '🎲Roll the dice!🎲', value: `6 sided die.`},
                                                    {name: '\u200B', value: '\u200B'},
                                                    {name: `The computer rolled!🎲`, value: diceRollComputer, inline: true},
                                                    {name: 'You rolled!🎲', value: diceRollUser, inline: true},
                                                )
                                                .setTimestamp()
                                                .setFooter('Provided by corpse#4655');

                                            message.reply(embed);

                                            if (diceRollComputer > diceRollUser) {
                                                message.channel.send(`It seems you have lost the game. (You lost ${userBet}💰)`);
                                            } else if (diceRollUser > diceRollComputer) {
                                                let userProfit = userBet * 2;
                                                message.channel.send(`Congratulations! You won: ${userProfit}💰 (Your bet x2)`);
                                                message.client.currency.add(message.author.id, userProfit);
                                            } else if (diceRollComputer === diceRollUser) {
                                                message.client.currency.add(message.author.id, userBet);
                                                return message.channel.send(`Its.. a draw?\nYou got back ${userBet}💰`);
                                            } else {
                                                message.channel.send("I'm... not quite sure what happened. My apologies, here's your money back, plus some extra for the inconvenience.");
                                                message.client.currency.add(message, author.id, userBet + 1000);
                                            }

                                        }
                                    })
                                }
                            })
                        })
                    }
                } else {
                    message.channel.send("Alright, come back another time!");
                   return message.reply("Psst. Type the word yes to accept the offer next time!")
                }
            })
        })
        .catch(() => {
            message.channel.send('Hey, did you fall asleep? (Time ran out.) 1');
        });
    }
}
