const { MessageEmbed } = require("discord.js");
const { userHasItem } = require(`${__basedir}/functions`);


module.exports = {
    name: "coinflip",
    description: "Flip a coin!",

    usage: [
        { tag: "bet", checks: {isinteger: null},
            next: [
                { tag: "prediction", checks: {isin: ["heads", "tails"]} }
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

        // Check if the user has a casino membership

        if (args[0] === "rules") {
            const embed = new MessageEmbed()
                .setTitle("Coinflip")
                .setDescription("The player calls either heads or tails, the computer then flips a coin. If the player is correct, they gain their bet.")
                .setColor(randomColor);
            
            message.channel.send({embeds: [embed]});
            return;
        }

        const userBet = Number.parseInt(args[0]);
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

        const userChoice = args[1];
        if (!userChoice) {
            message.channel.send("🎲The coin landed on the floor. You didn't call it out!🎲");
            return;
        }

        function coinflip() {
            return Math.floor(Math.random() * 2);
        }

        const coinflipResult = coinflip();

        function gameResult() {
            if (coinflipResult === 1) {
                return "heads";
            }

            else if (coinflipResult === 0) {
                return "tails";
            }
        }

        const embed = new MessageEmbed()
            .setTitle("The coin has landed!")
            .setColor(randomColor);

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

        checkResult();




    }
};
