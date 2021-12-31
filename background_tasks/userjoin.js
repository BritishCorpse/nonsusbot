const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'userjoin',
    execute(client) {
        client.on('guildMemberAdd', (guildMember) => {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);

            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            const embed = new MessageEmbed()
            .setTitle(`Welcome @${guildMember.displayName} to ${guildMember.guild.name}!`)
            .setColor(randomColor)

            channel.send({embeds: [embed]})
        });
    }
}