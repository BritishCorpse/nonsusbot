const { MessageEmbed } = require("discord.js");
const { userHasItem } = require(`${__basedir}/functions`);


module.exports = {
    name: "numbergame",
    description: "Play a game of guess the number!",

    usage: [
        { tag: "bet", checks: {isinteger: null},
            next: [
                { tag: "lives", checks: {isinteger: null} }
            ]
        },
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

        const userBet = Number.parseInt(args[0]);
        let userLives = Number.parseInt(args[1]);
        const divProfit = Number.parseInt(args[1]);
        const numberRange = userBet / 10;
        const gameNumber = Math.floor(Math.random() * numberRange);

        if (userBet === "rules") {
            const embed = new MessageEmbed()
                .setTitle("Rules of the number game.")
                .setDescription("The player attempts to guess the number within a specified range, the range is specified as the users bet (first argument) divided by 10.\nThe player also has an option to choose how many lives they have, the maximum amount of lives is 10.\nIf they player wins, the players profit will be 2 times the amount of coins they bet, divided by how many lives they chose. For example: Bet = 100, Lives = 10, Profit = 20.\nThe maximum bet for this gamemode is 100 million 💰's.")
                .setColor(randomColor);
            
            message.channel.send({embeds: [embed]});
            return;
        }
        // Make sure userbet exists, and that it follows all the perimeters.
        else if (!userBet) {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}numbergame {bet} {lives}🎲`);
            return;
        } else if (userBet > 100000000 || userBet < 100) {
            message.channel.send("Your bet is either to small, or too large.");
            return;
        }

        // Make sure userlives exists, and theyre in the correct range for no errors while doing math.
        if (!userLives) {
            message.channel.send(`🎲You did not specify your lives! Usage: ${prefix}numbergame {bet} {lives}🎲`);
            return;
        } else if (userLives > 1000 || userLives < 1 || userLives > numberRange / 2) {
            message.channel.send(`You either selected too many or too little lives! Usage: ${prefix}numbergame {bet} {lives}`);
            return;
        }

        // temporarily take their bet
        message.client.currency.add(message.author, -userBet);

        message.channel.send("Remember, there are no hints, so you will have to rely on your luck. With that being said, good luck! You'll need it.");

        const embed = new MessageEmbed()
            .setTitle("1️⃣A game of guess the number3️⃣")
            .setColor(randomColor)
            .setDescription(`Guess the number! The number is within the range of ${numberRange} to 0.`);

        message.channel.send({embeds: [embed]}).then(botMessage => {
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, time: 60000 });
    
            collector.on("collect", m => {
                if (m.content != gameNumber) {
                    userLives--;

                    if (userLives < 1) {
                        const endEmbed = new MessageEmbed()
                            .setTitle("The game has ended!")
                            .setColor(randomColor)
                            .setDescription(`You lost! The number was ${gameNumber}.`)
                            .setFooter(`-${userBet}💰`);

                        message.channel.send({embeds: [endEmbed]});
                        collector.stop();
                        return;
                    }

                    embed.addField(`Your guess was: ${m.content}, that's wrong!`, `-1 life, current lives ${userLives}`);

                    botMessage.edit({embeds: [embed]});
                }
    
                else {
                    const userProfit = userBet * 2 / divProfit;
                    
                    const winEmbed = new MessageEmbed()
                        .setTitle("The game has ended!")
                        .setColor(randomColor)
                        .setDescription(`You win! The number was ${gameNumber}. Good job!`)
                        .setFooter(`+${userProfit}`);
                    message.client.currency.add(message.author.id, userBet + userProfit);

                    message.channel.send({embeds: [winEmbed]});
                    collector.stop();
                    return;
                }
            });
    
            collector.on("end", collected => {
                if (collected.size < 0) {
                    message.channel.send("Did you fall asleep?");
                    // keep their bet
                }
            });
        });
    }
};
