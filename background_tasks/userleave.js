module.exports = {
    name: 'userleave',
    execute(client) {
        client.on('guildMemberRemove', (guildMember) => {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            const embed = new MessageEmbed()
            .setTitle(`@${guildMember.displayName} left ${guildMember.guild.name}.`)
            .setColor("ORANGE")

            channel.send({embeds: [embed]})
        });
    }
}