const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');


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
    }

    makeAceEleven() {
        if (this.isAce)
            this.value = 11;
    }

    makeAceOne() {
        if (this.isAce)
            this.value = 1;
    }

    show() {
        // turns it to a string
        if (this.isAce) // ace
            return `Ace(${this.value})`;
        else if (this.identifier < 11) // 2 to 10
            return `${this.value}`;
        else // face cards
            return `${['Jack', 'Queen', 'King'][this.identifier - 11]}(${this.value})`;
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
    name: 'blackjack',
    description: 'Play against the computer in a game of blacjack.',
    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const userBet = Number.parseInt(args[0]);

        if (args[0] === 'rules') {
            const embed = new MessageEmbed()
            .setTitle("Rules of blackjack.")
            .setColor("ORANGE")
            .setDescription(
                `Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.\nThe player to the left goes first and must decide whether to "stand" (not ask for another card) or "hit" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes "bust" (if it is over 21). In the latter case, the player loses and the dealer collects the bet wagered. The dealer then turns to the next player to their left and serves them in the same manner.\nWhen the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.\nThe maximum bet for this gamemode is 25 million 💰's.`
            )
            .addField('Rules credit', "[Bicycle Cards](https://bicyclecards.com/how-to-play/blackjack/)");

            message.channel.send({embeds: [embed]});
            return;
        } else if (args[0] === undefined || args[0] === '') {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}blackjack <bet>🎲`);
            return;
        } else if (userBet <= 0 || userBet.toString() === 'NaN') { // invalid bets
            message.channel.send("🎲You must give a valid bet!🎲");
            return;
        } else if (userBet > 25000000) {
            message.channel.send("🎲Unfortunately your bet is too large for this game. We can't have you being too successful after all!🎲");
            return;
        }
        
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

        const dealerCards = [];
        //for (let i = 0; i < 2; ++i) {
        //    dealerCards.push(getCard());
        //}
        dealerCards.push(new Card(1));
        dealerCards.push(new Card(2));
        // draw more cards, or make ace 11, to bring score between 17 and 21
        while (getScore(dealerCards) < 17) {
            console.log(dealerCards);
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

        console.log('NOT STUCK');

        const userCards = [];
        // starting cards
        for (let i = 0; i < 2; ++i) {
            userCards.push(getCard());
        }

        function getGameStateEmbed() {
            const embed = new MessageEmbed()
                .setTitle("🃏Blackjack🃏")
                .setColor("ORANGE");

            for (const i in dealerCards) {
                embed.addField(...getCardEmbedFieldArguments(dealerCards[i], 'The dealer', Number.parseInt(i) + 1));
            }
            
            embed.addField("\u200b", "\u200b"); // space

            for (const i in userCards) {
                embed.addField(...getCardEmbedFieldArguments(userCards[i], `${message.member.nickname}`, Number.parseInt(i) + 1));
            }

            return embed;
        }

        const embed = getGameStateEmbed();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('stand')
                    .setLabel('🏳️')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('hit')
                    .setLabel('🚩')
                    .setStyle('DANGER')
            );

        message.channel.send({embeds: [embed], components: [row]}).then(botMessage => {
            const filter = interaction => (interaction.customId === 'stand'
                                           || interaction.customId === 'hit')
                                          && interaction.user.id === message.author.id;

            const collector = botMessage.createMessageComponentCollector({filter, time: 60000});

            function endGame() {
                const dealerScore = getScore(dealerCards);
                const userScore = getScore(userCards);

                const gameEndEmbed = getGameStateEmbed()
                    .setTitle("Here are the results!")
                    .addField("\u200b", "\u200b") // space
                    .addField("The dealer's total amount is:", `${dealerScore}`)
                    .addField(`${message.member.nickname}'s total amount is:`, `${userScore}`);

                // TODO: make this cleaner:
                if (dealerScore > 21) {
                    gameEndEmbed.setFooter(`The dealer got a bust! ${message.member.nickname} won the game! +${userBet}💰`)
                    message.client.currency.add(message.author.id, userBet);
                } else if (userScore > 21) {
                    gameEndEmbed.setFooter(`${message.member.nickname} got a bust! The dealer won the game! -${userBet}💰`);
                    message.client.currency.add(message.author.id, -userBet);
                } else if (userScore < dealerScore) {
                    gameEndEmbed.setFooter(`${message.member.nickname} lost the game! -${userBet}💰`);
                    message.client.currency.add(message.author.id, -userBet);
                } else if (userScore > dealerScore) {
                    gameEndEmbed.setFooter(`${message.member.nickname} won the game! +${userBet}💰`)
                    message.client.currency.add(message.author.id, userBet);
                } else {
                    gameEndEmbed.setFooter("It's a draw!");
                }

                botMessage.edit({embeds: [gameEndEmbed]});
                collector.stop();
            }

            //let hitTimes = 0;

            collector.on('collect', interaction => {
                if (interaction.customId === 'stand') {
                    interaction.deferUpdate();
                    endGame();
                } else if (interaction.customId === 'hit') {
                    // Take a new card
                    userCards.push(getCard());

                    const userScore = getScore(userCards);

                    if (userScore > 21) { // bust
                        interaction.deferUpdate();
                        endGame();
                    } else {
                        interaction.update({embeds: [getGameStateEmbed()]});
                    }

                    //hitTimes++;
                }
            });
            
            collector.on('end', collected => {
                console.log('ended');
                if (collected.size < 1) {
                    message.channel.send(`Hello? Did you fall asleep?\nYou can't escape the loss, You lost ${userBet}💰`);
    
                    message.client.currency.add(message.author.id, -userBet);
                }

                row.components.forEach(button => button.setDisabled(true));
                botMessage.edit({components: [row]});
            }); 

            // check if dealer already busted (right after drawing the cards)
            if (getScore(dealerCards) > 21) {
                endGame();
                return;
            } else if (getScore(dealerCards) === 21) { // check if dealer already won
                endGame();
                return;
            }
        });
    }
}
