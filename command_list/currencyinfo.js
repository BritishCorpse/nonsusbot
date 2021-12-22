module.exports = {
    name: 'currencyinfo',
    description: "Information about Graveyard's currency system.",
    execute(message, args){
        const Discord = require('discord.js')
        const client = new Discord.Client()
        const {MessageEmbed} = require('discord.js');
        var embed = new MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.avatarURL())
        .setTitle("Graveyard currency system.")
        .addField("Prefix:", "!")
        .addField("Gain money by sending messages!", "1 message = 1 coin.")
        .addField("Spend money at shops with !shop!", "!buy to select the item to buy.")
        .addField("Transfer money: ", "!tranfer {amount}")
        .setColor("ORANGE")

        message.channel.send(embed)
    }
}