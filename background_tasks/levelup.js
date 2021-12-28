module.exports = {
    name: 'levelup',
    execute(client) {
        client.on('messageCreate', message => {
            // this uses other bot's leveling systems and says good job i am proud in that channel
            const channel = client.channels.cache.get(client.serverConfig.get(message.guild.id).level_channel_id);

            if (channel === undefined || message.guild === null || message.author.bot) return;

            if (message.channel.id !== channel.id) return;

            message.channel.send("Good job! I'm proud.")
        });
    }
}
