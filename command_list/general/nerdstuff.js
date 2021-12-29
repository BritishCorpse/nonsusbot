const { MessageEmbed, Message } = require('discord.js');
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: 'nerdstuff',
    description: 'Full changelog.',
    execute(message, args) {
        let prefix = message.client.serverConfig.get(message.guild.id).prefix;

        let embed1 = new MessageEmbed()
        .setTitle("Graveyard version 1.1.2 changelog.")
        .setColor("ORANGE")
        .setDescription("Everything new in Graveyard V1.1.2, The currency update!")
        .setFooter(`${prefix}changelog for a simpler revision of this.`)

        let embed2 = new MessageEmbed()
        .setTitle("New commands.")
        .setColor("ORANGE")
        .addField("Currency commands.", "\u200b")
        .addField("Added new commands: shop, buy, currencyinfo, givemoney(not available to non-developers), inventory, leaderboard, loan, resetmoney, transfer, vip", `\u200b`)
        .addField("Fun commands.", "\u200b")
        .addField("Added new commands: hug, kiss, pet, slap", `\u200b`)
        .setFooter(`Usage for commands: ${prefix}{command} {optional or required argument}`)

        let embed3 =new MessageEmbed()
        .setTitle("New functions")
        .setColor("ORANGE")
        .setDescription("Added functions for commonly used things, like checking a users inventory.")

        let embed4 = new MessageEmbed()
        .setTitle("Gamble commands.")
        .setColor("ORANGE")
        .addField("Added new commands: dice, blackjack, numbergame", `\u200b`)

        let embed5 = new MessageEmbed()
        .setTitle("Bug fixes and known issues.")
        .setColor("ORANGE")
        .setDescription("Chat command does not work, message logging was removed, deleted command issues were fixed, made many minor changes in code, started using github branches.")
        
        message.channel.send({embeds: [embed1, embed2, embed3, embed4, embed5]});
    }
}