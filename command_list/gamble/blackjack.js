//const { Op } = require('sequelize');
const { MessageEmbed/*, DiscordAPIError*/ } = require("discord.js");
//const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);

module.exports = {
    name: 'blackjack',
    description: 'Play against the computer in a game of blacjack.',
    execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;
        //thingy checks gamble pass
        //remember to do later kthx

        const userBet = args[0];
        if (userBet === undefined) {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}dice {bet}🎲`);
            return;

        } else if (userBet > 25000000) {
            message.channel.send("🎲Unfortunately your bet is too large for this game, We can't have you being too successful after all!🎲");
            return;

        } else if (userBet === 'rules') {
            const embed = new MessageEmbed()
            .setTitle("Rules of blackjack.")
            .setColor("ORANGE")
            .setDescription(
                `Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.\nThe player to the left goes first and must decide whether to "stand" (not ask for another card) or "hit" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes "bust" (if it is over 21). In the latter case, the player loses and the dealer collects the bet wagered. The dealer then turns to the next player to their left and serves them in the same manner.\nWhen the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.\nThe maximum bet for this gamemode is 25 million 💰's`
            )
            .setFooter("Rule credit: https://bicyclecards.com/how-to-play/blackjack/")

            return message.channel.send({embeds: [embed]});
        };




        // Pulls a random card from the imaginary deck.
        const rollCard = () => Math.floor(Math.random() * (14 - 2) + 2);

        let dealerFirstCard = rollCard();
        let dealerSecondCard = rollCard();
        //console.log(dealerFirstCard, dealerSecondCard);

        let userFirstCard = rollCard();
        let userSecondCard = rollCard();
        let userThirdCard = rollCard();
        let userFourthCard = rollCard();
        let userFifthCard = rollCard();

        function calculateCardTotal(x1, x2, x3, x4) {
            if (x1 > 10) x1 = 10;
            if (x2 > 10) x2 = 10;
            if (x3 > 10) x3 = 10;
            if (x4 > 10) x4 = 10;

            let result = x1 + x2 + x3 + x4;
            return result;
        }

        const embed = new MessageEmbed()
            .setTitle("🃏The users cards!🃏")
            .setColor("ORANGE");

        //console.log(userFirstCard, userSecondCard);

        function checkForCardType(inputCard, player, cardPlace) {
            if (inputCard < 11) {
                embed.addField(`${player}'s ${cardPlace} card is:`, `${inputCard}`);
            }  else if (inputCard === 11) {
                embed.addField(`${player}'s ${cardPlace} card is:`, `Jack(10)`);
            } else if (inputCard === 12) {
                embed.addField(`${player}'s ${cardPlace} card is:`, `Queen(10)`);
            } else if (inputCard === 13) {
                embed.addField(`${player}'s ${cardPlace} card is:`, `King(10)`);
            } else if (inputCard === 14) {
                embed.addField(`${player}'s ${cardPlace} card is:`, `Ace(10)`);
            } else {
                console.log(inputCard);
                return;
            }
        }

        // Check cardtypes for dealer's first card and users first and second card.
        checkForCardType(dealerFirstCard, "The dealer", "first");
        checkForCardType(userFirstCard, message.author.username, "first");
        checkForCardType(userSecondCard, message.author.username, "second")

        message.channel.send({embeds: [embed]}).then(botMessage => {
            const filter = (reaction, user) => (reaction.emoji.name === "🏳️" || reaction.emoji.name === "🚩") && user.id === message.author.id;
            const collector = botMessage.createReactionCollector({ filter, time: 60000 });

            let hitTimes = 0;

            botMessage.react("🏳️").then(() => {
                botMessage.react("🚩"); //hit
            });

            function endGame(hasFourth=false) {
                let dealerResult = calculateCardTotal(dealerFirstCard, dealerSecondCard, 0, 0);
                let userResult = calculateCardTotal(userFirstCard, userSecondCard, 0, 0);

                const gameEndEmbed = new MessageEmbed()
                    .setTitle("Here are the results!")
                    .setColor("ORANGE")
                    .addField("The dealer's first card is:", `${dealerFirstCard}`)
                    .addField("The dealer's second card is:", `${dealerSecondCard}`)
                    .addField("The dealers total amount is:", `${dealerResult}`)
                    .addField("\u200b", "\u200b")
                    .addField(`${message.author.username}'s first card is:`, `${userFirstCard}`,)
                    .addField(`${message.author.username}'s second card is:`, `${userSecondCard}`);;

                if (hasFourth) {
                    gameEndEmbed.addField(`${message.author.username}'s third card is:`, `${userThirdCard}`);
                }

                gameEndEmbed.addField(`${message.author.username}'s total amount is:`, `${userResult}`)

                let userCardSum = calculateCardTotal(userFirstCard, userSecondCard, userThirdCard, userFourthCard);
                if (userCardSum > 21) {
                    gameEndEmbed.setFooter(`${message.author.username} got a bust! -${userBet}💰`);
                    message.client.currency.add(message.author.id, -userBet);
                }

                if (dealerResult > userResult) {
                    gameEndEmbed.setFooter(`${message.author.username} lost the game! -${userBet}💰`);
                    message.client.currency.add(message.author.id, -userBet);
                }

                else if (dealerResult === userResult) {
                    gameEndEmbed.setFooter(`It's a draw!`);
                }

                else if (dealerResult < userResult) {
                    gameEndEmbed.setFooter(`${message.author.username} won the game! +${userBet}💰`)
                    message.client.currency.add(message.author.id, userBet);
                }

                botMessage.edit({embeds: [gameEndEmbed]});
                collector.stop();
                return;
            }
            
            collector.on('collect', reaction => {
                botMessage.reactions.resolve(reaction.emoji.name).users.remove(message.author);

                // Check for users card sum if over 21, endGame with a loss.
                if (hitTimes === 1) {
                    hitTimes++;

                    message.channel.send("yes2");
                    checkForCardType(userFourthCard, message.author.username, "fourth");
                    botMessage.edit({embeds: [embed]});

                    let userCardSum = calculateCardTotal(userFirstCard, userSecondCard, userThirdCard, userFourthCard);
                    if (userCardSum > 21) {
                        endGame(true);
                    } else {
                        // fix this
                        endGame(true);
                    }
                } else {
                    if (reaction.emoji.name === '🏳️') {
                        endGame();
                    } else if (reaction.emoji.name === '🚩') {
                        hitTimes++;

                        checkForCardType(userThirdCard, message.author.username, "third");
                        message.channel.send("yes");

                        let userCardSum = calculateCardTotal(userFirstCard, userSecondCard, userThirdCard, 0);
                        if (userCardSum > 21) {
                            endGame()
                        }
                        botMessage.edit({embeds: [embed]});
                        return;
                    }
                }
            });
            
            collector.on('end', collected => {
                if(collected.size < 1) {
                    message.channel.send(`Hello? Did you fall asleep?\nYou can't escape the loss, You lost ${userBet}💰`);
    
                    message.client.currency.add(message.author.id, -userBet);
                    return;
                }
            }); 
        })




    }
}
