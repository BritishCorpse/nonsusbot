const { Op } = require('sequelize');
const { MessageEmbed } = require("discord.js");
const { Users, CurrencyShop } = require('../db_objects');

module.exports = {
    name: 'dice',
    category: 'currency',
    description: 'Play against the computer in a game of dice. Whoever rolls higher wins.',
    async execute(message, args){
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;
        // Check if the user has a vip pass
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: "Casino Membership" 
                }
            }
        });

        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });

        function hasNoCasinoMemberShip() {
            return message.channel.send(`It appears you are not a member of the casino. Please go to ${prefix}shop and go buy a Casino Membership.`);
        }

        if (user === null) { // user doesn't exist in database
            hasNoCasinoMemberShip();
            return;
        }

        const userItems = await user.getItems();
        
        let hasCasinoMemberShip = false;
        for (const userItem of userItems) {
            const userCasinoMember = userItems.find(userItem => userItem.item_id == item.id);

            if (userCasinoMember !== undefined) { // found the item
                hasCasinoMemberShip = true;
                break;
            }
        }

        if (hasVip) {        
            message.channel.send("You have casino membership.");
        } else {
            hasNoCasinoMemberShip();
        }

        //Starting playing dice game.
        let userBet = args[0];
        if (userBet === undefined) {
            return message.channel.send(`🎲You did not specify your bet! Usage: ${prefix}dice {bet}🎲`);
        }

        else if (userBet > 10000000) {
            return message.channel.send("🎲Unfortunately your bet is too large for this game, We can't have you being too successful after all!🎲");
        };

        const roll = () => Math.floor(Math.random() * 7)
        const diceRollComputer = roll();
        const diceRollUser = roll();

        const embed = new MessageEmbed()
        .setTitle("🎲A game of dice!🎲")
        .setColor("ORANGE")
        .addField("🎲The computer rolled:🎲", `${diceRollComputer}`)
        .addField("🎲You rolled:🎲", `${diceRollUser}`)
        
        if (diceRollUser > diceRollComputer) {
            embed.setFooter("YOU WIN!")
            message.client.currency.add(message.author.id, userBet);
        }

        else if (diceRollComputer > diceRollUser) {
            embed.setFooter("YOU LOSE")
            message.client.currency.add(message.author.id, -userBet);
        }

        else if (diceRollComputer === diceRollUser) {
            embed.setFooter("ITS A DRAW")
            message.client.currency.add(message.author.id, -10);
        }

        else {
            return message.channel.send("Im not sure what happened.")
        }

        message.channel.send({embeds: [embed]});
    }
}