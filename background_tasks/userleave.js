module.exports = {
    name: 'userleave',
    execute(client) {
        client.on('guildMemberRemove', (guildMember) => {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            console.log("yes2")
            channel.send(`${guildMember} left ${guildMember.guild.name}.`)
        });
    }
}