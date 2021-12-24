const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'currencyinfo',
    category: "Currency",
    description: "Information about Graveyard's currency system.",
    execute (message, args) {
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL()) // see i would do that but i have developed ptsd from the shop command not working without quotations
            .setTitle("Graveyard currency system.")
            //.addField("Prefix:", "!")
            .addField("NOTE: FIX THIS COMMAND")
            .addField("Gain money by sending messages!", "1 message = 1 coin.")
            .addField("Spend money at shops with !shop!", "!buy to select the item to buy.")
            .addField("Transfer money: ", "!tranfer {amount}")
            .setColor("ORANGE");

        message.channel.send({embeds: [embed]});
    }
}
