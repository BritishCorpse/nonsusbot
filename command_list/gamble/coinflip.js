const { MessageEmbed } = require("discord.js");

const { userHasItem } = require(`${__basedir}/functions`);


module.exports = {
    name: 'coinflip',
    description: 'Flip a coin!',

    usage: [
        { tag: "bet", checks: {isinteger: null},
            next: [
                { tag: "prediction", checks: {isin: ["heads, tails"]} },
                { tag: "nothing", checks: {isempty: null} }
            ]
        }
    ],

    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // Check if the user has a casino membershio

        let userBet = args[0];
        if (userBet === undefined) {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}coinflip {bet} {heads or tails}🎲`);
            return;
        }

        else if (userBet > 10000000 || userBet < 10) {
            message.channel.send("🎲Your bet is either too small, or too large!🎲");
            return;
        }

        else if (isNaN(userBet)) {
            message.channel.send(`I don' think ${userBet} is a number.`);
            return;
        }

        else if (userBet === 'rules') {
            const embed = new MessageEmbed()
            .setTitle("Coinflip")
            .setDescription(`The player calls either heads or tails, the computer then flips a coin. If the player is correct, they get ${userBet}💰's.`)
            .setColor("ORANGE")
            
            return message.channel.send({embeds: [embed]});
        }

        let userChoice = args[1];
        if (!userChoice) {
            message.channel.send(`🎲The coin landed on the floor. You didn't call it out!🎲`);
            return;
        }

        function coinflip() {
            return Math.floor(Math.random() * 2)
        }

        let coinflipResult = coinflip()

        function gameResult() {
            if (coinflipResult === 1) {
                return 'heads'
            }

            else if (coinflipResult === 0) {
                return 'tails'
            }
        }

        const embed = new MessageEmbed()
        .setTitle("The coin has landed!")
        .setColor("ORANGE")

        function checkResult() {
            if (gameResult() === userChoice) {
                embed.setDescription(`It's ${gameResult()}! You were correct! +${userBet}💰`);
                message.client.currency.add(message.author.id, userBet);
            }

            else if (gameResult !== userChoice) {
                embed.setDescription(`It's ${gameResult()}! You were incorrect! -${userBet}💰`);
                message.client.currency.add(message.author.id, -userBet);
            }

            else {
                message.channel.send("How did this happen?!");
                message.client.currency.add(message.author.id, 10);
                return;
            }

            message.channel.send({embeds: [embed]});
        }

        checkResult()




    }
}
