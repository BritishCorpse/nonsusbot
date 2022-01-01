const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'currencyinfo',
    description: "Shows information about Graveyard's currency system.",

    usage: [
    ],

    execute (message, args) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);

        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL()) // see i would do that but i have developed ptsd from the shop command not working without quotations
            .setTitle("Graveyard currency system.")
            //.addField("Prefix:", "!")
            .addField("NOTE: FIX THIS COMMAND", 'uwu')
            .addField("Gain money by sending messages!", "1 message = 1 coin.")
            .addField("Spend money at shops with !shop!", "!buy to select the item to buy.")
            .addField("Transfer money: ", "!tranfer {amount}")
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
    }
}
