const { Op } = require('sequelize');
const { MessageEmbed } = require("discord.js");
const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);

module.exports = {
    name: 'blackjack',
    description: 'Play against the computer in a game of blacjack.',
    execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;
        //thingy checks gamble pass
        //remember to do later kthx

        let userBet = args[0];
        if (userBet === undefined) {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}dice {bet}🎲`);
            return;
        }

        else if (userBet > 25000000) {
            message.channel.send("🎲Unfortunately your bet is too large for this game, We can't have you being too successful after all!🎲");
            return;
        };

        //rules of blacjack, dealer shows 1 card, player is given 2 cards, options are hit and stand
        //if userCardSum is over 21 the player fails the game
        //compare computerCardSum to userCardSum, whichever is closest wins

        //thing spits our random card 1-11
        //if number is 10, choose between a random picture card, (king queen jack)
        //if number is 11, state the card is an ace
        //if number is below 10, state the card is a regular picture card

        // Pulls a random card from the imaginary deck.
        const rollCard = () => Math.floor(Math.random() * 12);
        // Chooses between King, Queen and Jack.
        const choosePictureCard = () => Math.floor(Math.random() * 5)

        let dealerFirstCard = rollCard()
        let dealerSecondCard = rollCard()
        console.log(dealerFirstCard, dealerSecondCard)

        let userFirstCard = rollCard()
        let userSecondCard = rollCard()
        let userThirdCard = rollCard()
        let userFourthCard = rollCard()
        let userFifthCard = rollCard()

        function calculateCardTotal(x1, x2) {
            let result = x1 + x2
            return result
        }

        const dealerEmbed = new MessageEmbed()
        .setTitle("🃏The dealers cards!🃏")
        .setColor("ORANGE")

        if (dealerFirstCard === 10) {
            let pictureCard = choosePictureCard()

            if (pictureCard === 1) {
                dealerEmbed.addField("dealerFirstCard", "Jack(10)", inline=true);
                dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
                dealerEmbed.addField("Dealer total:", `${dealerFirstCard}`, inline=true);
            }

            else if (pictureCard === 2) {
                dealerEmbed.addField("dealerFirstCard", "Queen(10)", inline=true);
                dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
            }

            else if (pictureCard === 3) {
                dealerEmbed.addField("dealerFirstCard", "King(10)", inline=true);
                dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
            }

            else if (pictureCard === 4) {
                dealerEmbed.addField("dealerFirstCard", "10", inline=true);
                dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
            }
            
            else {
                message.channel.send("no");
                return;
            };
        }

        else if (dealerFirstCard === 11) {
            dealerEmbed.addField("dealerFirstCard", "Ace(11)", inline=true);
            dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
        }

        else if (dealerFirstCard < 10) {
            dealerEmbed.addField("dealerFirstCard", `${dealerFirstCard}`, inline=true);
            dealerEmbed.addField("dealerSecondCard", "Hidden", inline=true);
        }

        message.channel.send({ embeds: [dealerEmbed] })

        const userEmbed = new MessageEmbed()
        .setTitle("🃏The users cards!🃏")
        .setColor("ORANGE")

        console.log(userFirstCard, userSecondCard)

        if (userFirstCard === 10) {
            let pictureCard = choosePictureCard()

            if (pictureCard === 1) {
                userEmbed.addField("userFirstCard", "Jack(10)", inline=true);
            }

            else if (pictureCard === 2) {
                userEmbed.addField("userFirstCard", "Queen(10)", inline=true);
            }

            else if (pictureCard === 3) {
                userEmbed.addField("userFirstCard", "King(10)", inline=true);
            }

            else if (pictureCard === 4) {
                userEmbed.addField("userFirstCard", "10", inline=true);

            }
            
            else {
                message.channel.send("no");
                return;
            };
        }
        
        else if (userFirstCard === 11) {
            userEmbed.addField("userFirstCard", "Ace(11)", inline=true);
        }

        else if (userFirstCard < 10) {
            userEmbed.addField("userFirstCard", `${userFirstCard}`, inline=true);
        }

        if (userSecondCard === 10) {
            let pictureCard = choosePictureCard()

            if (pictureCard === 1) {
                userEmbed.addField("usersecondCard", "Jack(10)", inline=true);
            }

            else if (pictureCard === 2) {
                userEmbed.addField("usersecondCard", "Queen(10)", inline=true);
            }

            else if (pictureCard === 3) {
                userEmbed.addField("usersecondCard", "King(10)", inline=true);
            }

            else if (pictureCard === 4) {
                userEmbed.addField("usersecondCard", "10", inline=true);

            }
            
            else {
                message.channel.send("no");
                return;
            };
        }
        
        else if (userSecondCard === 11) {
            userEmbed.addField("usersecondCard", "Ace(11)", inline=true);
        }

        else if (userSecondCard < 10) {
            userEmbed.addField("usersecondCard", `${userFirstCard}`, inline=true);
        }

        let userTotal = calculateCardTotal(userFirstCard, userSecondCard);
        if (userTotal > 21) {
            message.channel.send("BUST!");
            message.client.currency.add(message.author.id, -userBet);
            return;
        }

        else {
            userEmbed.addField("User card total:", `${userTotal}`)
        }


        message.channel.send({ embeds: [userEmbed] })



    }
}
