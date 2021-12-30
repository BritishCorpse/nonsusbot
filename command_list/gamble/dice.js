const { MessageEmbed } = require("discord.js");
const { userHasItem } = require(`${__basedir}/functions`);


module.exports = {
    name: 'dice',
    description: 'Play against the computer in a game of dice.',
    async execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        // Check if the user has a casino membershio
        if (!await userHasItem(message.author.id, "Casino Membership")) {
            message.channel.send(`It appears you are not a member of the casino. Please go to ${prefix}shop and go buy a Casino Membership.`);
            return;
        }

        // Starting playing dice game.
        let userBet = args[0];
        if (userBet === undefined) {
            message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}dice {bet}🎲`);
            return;
        }

        else if (userBet > 10000000) {
            message.channel.send("🎲Your bet is not supported, too large or too small.🎲");
            return;
        }

        else if (userBet === 'rules') {
            const embed = new MessageEmbed()
            .setTitle("Rules of dice.")
            .setDescription("The player and computer both roll a six sided die. Whichever party rolls a higher number on the die, wins. The maximum bet for this gamemode is 10 million 💰's.")
            .setColor("ORANGE")
            
            return message.channel.send({embeds: [embed]});
        }

        const roll = () => Math.floor(Math.random() * 7);
        const diceRollComputer = roll();
        const diceRollUser = roll();

        const embed = new MessageEmbed()
            .setTitle("🎲A game of dice!🎲")
            .setColor("ORANGE")
            .addField("🎲The computer rolled:🎲", `${diceRollComputer}`)
            .addField("🎲You rolled:🎲", `${diceRollUser}`);
        
        if (diceRollUser > diceRollComputer) {
            embed.setFooter("YOU WIN!");
            message.client.currency.add(message.author.id, userBet);
        } else if (diceRollComputer > diceRollUser) {
            embed.setFooter("YOU LOSE");
            message.client.currency.add(message.author.id, -userBet);
        } else if (diceRollComputer === diceRollUser) {
            embed.setFooter("ITS A DRAW");
            message.client.currency.add(message.author.id, -10);
        } else {
            message.channel.send("I'm not sure what happened.");
            return;
        }

        message.channel.send({embeds: [embed]});
    }
}
