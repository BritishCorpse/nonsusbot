const { MessageEmbed } = require("discord.js");
const { userHasItem } = require(`${__basedir}/utilities`);

const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["dice"],
    description: "Play against the computer in a game of dice.",

    usage: [
        { tag: "bet", checks: {ispositiveinteger: null} },
        { tag: "rules", checks: {is: "rules"} }
    ],

    async execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // check for casino membership
        if (!await userHasItem(message.author.id, "Casino Membership")) {
            message.channel.send(`You don't have a casino membership. See the ${prefix}shop to buy it.`);
            return;
        }

        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        // Starting playing dice game.
        const userBet = Number.parseInt(args[0]);

        if (userBet === "rules") {
            const embed = new MessageEmbed()
                .setTitle("Rules of dice.")
                .setDescription("The player and computer both roll a six sided die. Whichever party rolls a higher number on the die, wins. The maximum bet for this gamemode is 10 million 💰's.")
                .setColor(randomColor);
            
            message.channel.send({embeds: [embed]});
            return;
        } else if (userBet > 1000000000 || userBet <= 0) {
            message.channel.send("🎲Your bet is too large or invalid.🎲");
            return;
        } else if (userBet > message.client.currency.getBalance(message.author.id)) {
            message.channel.send("🎲You don't have enough money!🎲");
            return;
        }

        // temporarily take the bet
        message.client.currency.add(message.author.id, -userBet);

        const diceRollComputerOne = Math.floor(Math.random() * 6 + 1);
        const diceRollComputerTwo = Math.floor(Math.random() * 6 + 1);
        const diceRollUserOne = Math.floor(Math.random() * 6 + 1);
        const diceRollUserTwo = Math.floor(Math.random() * 6 + 1);

        const computerTotal = diceRollComputerOne + diceRollComputerTwo;
        const userTotal = diceRollUserOne + diceRollUserTwo;

        /*
        console.log(computerTotal);
        console.log(userTotal);
        console.log("scores");
        console.log(diceRollComputerOne, diceRollComputerTwo);
        console.log(diceRollUserOne, diceRollUserTwo);
        */

        const embed = new MessageEmbed()
            .setTitle(`${gravestone}A game of dice!${gravestone}`)
            .setColor(randomColor)
            .addField("The computer rolls:", `${diceRollComputerOne}🎲 and ${diceRollComputerTwo}🎲`)
            .addField("You roll:", `${diceRollUserOne}🎲 and ${diceRollUserTwo}🎲`);
        
        if (userTotal === computerTotal) {
            embed.addField("ITS A DRAW! YOU WIN!", `+${userBet}${gravestone}`);
            message.client.currency.add(message.author.id, userBet * 2);

        } else if (userTotal === 12) {
            embed.addField("DOUBLE SIXES!", `+${userBet * 2}${gravestone}`);
            // Here only remove the userBet from the casino and then pull the rest out of the aether.
            message.client.currency.add("1", -userBet);
            message.client.currency.add(message.author.id, userBet * 3); // give the bet back + twice the bet

        } else if (userTotal > computerTotal) {
            embed.addField("YOU WIN!", `+${userBet}${gravestone}`);
            message.client.currency.add("1", -userBet);
            message.client.currency.add(message.author.id, userBet * 2);

        } else if (computerTotal > userTotal) {
            embed.addField("YOU LOSE!", `-${userBet}${gravestone}`);
            message.client.currency.add("1", userBet); // casino balance

        } else {
            message.channel.send("I'm not sure what happened.");

            //Give the user their bet back because an error happened.
            message.client.currency.add(message.author.id, userBet);
            return;

        }

        message.reply({embeds: [embed]});
    }
};
