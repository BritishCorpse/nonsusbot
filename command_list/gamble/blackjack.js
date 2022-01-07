const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { userHasItem } = require(`${__basedir}/functions`);


/* Rules:
 * Each participant attempts to beat the dealer by getting a count as close to
 * 21 as possible, without going over 21.
 * It is up to each individual player if an ace is worth 1 or 11. Face cards
 * are 10 and any other card is its pip value.
 *
 * The player to the left goes first and must decide whether to "stand" (not
 * ask for another card) or "hit" (ask for another card in an attempt to get
 * closer to a count of 21, or even hit 21 exactly). Thus, a player may stand
 * on the two cards originally dealt to them, or they may ask the dealer for
 * additional cards, one at a time, until deciding to stand on the total (if it
 * is 21 or under), or goes "bust" (if it is over 21). In the latter case, the
 * player loses and the dealer collects the bet wagered. The dealer then turns
 * to the next player to their left and serves them in the same manner.
 *
 * When the dealer has served every player, the dealer's face-down card is
 * turned up. If the total is 17 or more, it must stand. If the total is 16 or
 * under, they must take a card. The dealer must continue to take cards until
 * the total is 17 or more, at which point the dealer must stand. If the dealer
 * has an ace, and counting it as 11 would bring the total to 17 or more (but
 * not over 21), the dealer must count the ace as 11 and stand. The dealer's
 * decisions, then, are automatic on all plays, whereas the player always has
 * the option of taking one or more cards.
 *
 * Whoever gets closer, dealer or player wins, if both get 21 its a draw, if
 * both get same its a draw. 
 */


function constrain(number, max) {
    return number > max ? max : number;
}


class Card {
    constructor(identifier) {
        // identifier is between 1 and 13 (ace to king)
        this.identifier = identifier;
        this.isAce = this.identifier === 1;

        this.value = constrain(this.identifier, 10);

        this.hidden = false; // for dealer's hidden card
    }

    makeAceEleven() {
        if (this.isAce)
            this.value = 11;
    }

    makeAceOne() {
        if (this.isAce)
            this.value = 1;
    }

    hide() {
        this.hidden = true;
    }

    unHide() {
        this.hidden = false;
    }

    show() {
        // turns it to a string
        if (this.hidden)
            return "Hidden";
        else if (this.isAce) // ace
            return `Ace(${this.value})`;
        else if (this.identifier < 11) // 2 to 10
            return `${this.value}`;
        else // face cards
            return `${["Jack", "Queen", "King"][this.identifier - 11]}(${this.value})`;
    }
}


function getScore(cards) {
    let result = 0;
    for (const card of cards) {
        result += card.value;
    }
    return result;
}


function getCardEmbedFieldArguments(card, player, cardNumber) {
    return [`${player}'s card #${cardNumber} is:`, card.show()];
}


module.exports = {
    name: "blackjack",
    description: "Play against the computer in a game of blackjack.",

    usage: [
        { tag: "bet", checks: {ispositiveinteger: null} },
        { tag: "rules", checks: {is: "rules"} }
    ],

    async execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // check for casino membership
        if (!await userHasItem(message.author.id, "Casino Membership")) {
            message.channel.send(`You don't have a casino membership. See the ${prefix}shop to buy it.`);
            return;
        }

        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const username = message.member.nickname || message.author.username;

        const userBet = Number.parseInt(args[0]);

        if (args[0] === "rules") {
            const embed = new MessageEmbed()
                .setTitle("Rules of blackjack.")
                .setColor(randomColor)
                .setDescription(
                    "Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.\nThe player to the left goes first and must decide whether to \"stand\" (not ask for another card) or \"hit\" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes \"bust\" (if it is over 21). In the latter case, the player loses and the dealer collects the bet wagered. The dealer then turns to the next player to their left and serves them in the same manner.\nWhen the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.\nThe maximum bet for this gamemode is 25 million 💰's."
                )
                .addField("Rules credit", "[Bicycle Cards](https://bicyclecards.com/how-to-play/blackjack/)");

            message.channel.send({embeds: [embed]});
            return;
        } else if (userBet <= 0) { // invalid bets
            message.channel.send("🎲You must give a valid bet!🎲");
            return;
        } else if (userBet > 25000000) {
            message.channel.send("🎲Unfortunately your bet is too large for this game. We can't have you being too successful after all!🎲");
            return;
        } else if (userBet > message.client.currency.getBalance(message.author.id)) {
            message.channel.send("🎲You don't have enough money!🎲");
            return;
        }

        // temporarily take away their money so they can't play two games of blackjack with the same money
        message.client.currency.add(message.author.id, -userBet);
        
        const usedCardIdentifiers = []; // keeps track of all cards taken so that they can't be taken anymore
        function getCard() {
            // Pulls a random card from the imaginary deck.
            let cardIdentifier;
            // Makes sure that there are only 4 of each card
            while (cardIdentifier === undefined || usedCardIdentifiers.filter(x => x === cardIdentifier).length > 3) {
                cardIdentifier = Math.floor(Math.random() * (14 - 1) + 1);
            }
            return new Card(cardIdentifier);
        }

        const dealerCards = [getCard(), getCard()];
        dealerCards[1].hide();

        // starting cards
        const userCards = [getCard(), getCard()];

        function getGameStateEmbed() {
            const embed = new MessageEmbed()
                .setTitle("🃏Blackjack🃏")
                .setColor(randomColor);

            // TODO: add hidden card stuff
            for (const i in dealerCards) {
                embed.addField(...getCardEmbedFieldArguments(dealerCards[i], "The dealer", Number.parseInt(i) + 1));
            }
            
            embed.addField("\u200b", "\u200b"); // space

            for (const i in userCards) {
                embed.addField(...getCardEmbedFieldArguments(userCards[i], `${username}`, Number.parseInt(i) + 1));
            }

            return embed;
        }

        const embed = getGameStateEmbed();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("stand")
                    .setLabel("🏳️")
                    .setStyle("SECONDARY"),
                new MessageButton()
                    .setCustomId("hit")
                    .setLabel("🚩")
                    .setStyle("DANGER")
            );

        message.channel.send({embeds: [embed], components: [row]}).then(botMessage => {1;
            let gameEnded = false; // used to cancel the message given if the user didn't do anything when the dealer automatically lost
            let stood = false;

            const filter = interaction => (interaction.customId === "stand"
                                           || interaction.customId === "hit"
                                           || interaction.customId === "toggleace")
                                          && interaction.user.id === message.author.id;

            const collector = botMessage.createMessageComponentCollector({filter, time: 60000});

            function endGame() {
                const dealerScore = getScore(dealerCards);
                const userScore = getScore(userCards);

                let userBalanceChange;
                let gameOverMessage;

                if (userScore > 21) {
                    userBalanceChange = -userBet;
                    gameOverMessage = `${username} got a bust! ${username} lost the game!`;
                } else if (dealerScore === userScore) {
                    userBalanceChange = 0;
                    gameOverMessage = "It's a draw!";
                } else if (userScore === 21 && userCards.length === 2) {
                    userBalanceChange = Math.floor(userBet * 1.5);
                    gameOverMessage = `${username} got a blackjack! ${username} won the game!`;
                } else if (dealerScore === 21 && dealerCards.length === 2) {
                    userBalanceChange = -userBet;
                    gameOverMessage = `The dealer got a blackjack! ${username} lost the game!`;
                } else if (dealerScore > 21) {
                    userBalanceChange = userBet;
                    gameOverMessage = `The dealer got a bust! ${username} won the game!`;
                } else if (userScore < dealerScore) {
                    userBalanceChange = -userBet;
                    gameOverMessage = `The dealer's score is greater than ${username}'s score! ${username} lost the game!`;
                } else if (userScore > dealerScore) {
                    userBalanceChange = userBet;
                    gameOverMessage = `${username}'s score is greater than the dealer's score! ${username} won the game!`;
                }

                const gameEndEmbed = getGameStateEmbed()
                    .setTitle("Here are the results!")
                    .addField("\u200b", "\u200b") // space
                    .addField("The dealer's total amount is:", `${dealerScore}`)
                    .addField(`${username}'s total amount is:`, `${userScore}`)
                    .setFooter({text: `${gameOverMessage} ${userBalanceChange >= 0 ? "+" : ""}${userBalanceChange}💰`});

                message.client.currency.add(message.author.id, userBet + userBalanceChange);

                botMessage.edit({embeds: [gameEndEmbed]});

                gameEnded = true;
                collector.stop();
            }

            function dealerPlay() {
                dealerCards[1].unHide();

                // draw more cards, or make ace 11, to bring score between 17 and 21
                while (getScore(dealerCards) < 17) {
                    const ace = dealerCards.find(card => card.isAce);
                    if (ace !== undefined && ace.value !== 11) {
                        // make ace 11 to try to bring score up (according to the rules he has to do this)
                        ace.makeAceEleven();

                        // check score again
                        if (getScore(dealerCards) > 21) {
                            // undo because having an ace as 11 would be too big
                            ace.makeAceOne();
                        } else {
                            continue; // don't take a card
                        }
                    }
                    // take a card
                    dealerCards.push(getCard());
                }
            }

            collector.on("collect", async interaction => {
                if (interaction.customId === "stand") {
                    if (stood || userCards.find(card => card.isAce) === undefined) {
                        dealerPlay(); 
                        interaction.deferUpdate();
                        endGame();
                    } else {
                        // turn the hit button into ace value toggle
                        row.components[1]
                            .setCustomId("toggleace")
                            .setLabel("Toggle ace value")
                            .setStyle("PRIMARY");
                        await interaction.update({components: [row]});
                    }
                    stood = true;
                } else if (interaction.customId === "hit") {
                    // Take a new card
                    userCards.push(getCard());
                    await interaction.update({embeds: [getGameStateEmbed()]});

                    if (getScore(userCards) > 21) {
                        dealerPlay();
                        endGame();
                    }
                } else if (interaction.customId === "toggleace") {
                    const ace = userCards.find(card => card.isAce);
                    if (ace.value === 1)
                        ace.makeAceEleven();
                    else
                        ace.makeAceOne();
                    await interaction.update({embeds: [getGameStateEmbed()]});
                }
            });
            
            collector.on("end", () => {
                if (!gameEnded) {
                    message.channel.send(`Hello? Did you fall asleep?\nYou can't escape the loss, You lost ${userBet}💰`);
                    // don't give the bet back
                }

                row.components.forEach(button => button.setDisabled(true));
                botMessage.edit({components: [row]});
            }); 

            if (dealerCards[0].isAce && dealerCards[1].value === 10
                || dealerCards[0].value === 10 && dealerCards[1].isAce) { // check if dealer already won
                dealerCards[1].unHide();
                // make the ace 11
                dealerCards[0].makeAceEleven();
                dealerCards[1].makeAceEleven();
                endGame();
            }
        });
    }
};
