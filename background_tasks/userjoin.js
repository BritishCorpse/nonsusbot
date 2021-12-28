const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'userjoin',
    execute(client) {
        client.on('guildMemberAdd', (guildMember) => {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            const embed = new MessageEmbed()
            .setTitle(`Welcome @${guildMember.displayName} to ${guildMember.guild.name}!`)
            .setColor("ORANGE")

            channel.send({embeds: [embed]})
        });
    }
}