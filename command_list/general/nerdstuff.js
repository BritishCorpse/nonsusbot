const { MessageEmbed, Message } = require('discord.js');
const prefix = message.client.serverConfig.get(message.guild.id).prefix;
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: 'nerdstuff',
    description: 'Full changelog.',
    execute(message, args) {
        const embeds = [
            new MessageEmbed()
            .setTitle("Graveyard version 1.1.2 changelog.")
            .setDescription("Everything new in Graveyard V1.1.2")
            .setFooter(`${prefix}changelog for a simpler revision of this.`),

            new MessageEmbed()
            .setTitle("New features")
            .addFields("Currency system", "\u200b")
            .addField(`${prefix}balance to see your balance.`, `Usage: ${balance} "{target}"`)
            .addField(`${prefix}shop to see the shop.`, `Usage: `)
        ]
    }
}