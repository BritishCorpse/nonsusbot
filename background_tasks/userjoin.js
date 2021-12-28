module.exports = {
    name: 'userjoin',
    execute(client) {
        client.on('guildMemberAdd', (guildMember) => {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            console.log("yes")
            channel.send(`Welcome ${guildMember} to ${guildMember.guild.name}`)
        });
    }
}