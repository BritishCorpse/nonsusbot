const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "messagelogging",
    execute(client) {
        // Deleted message logging
        client.on("messageDelete", message => {

            //const channel = client.channels.cache.get("825726316817023016");
            const logChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(message.content);

            logChannel.send({
                embeds: [embed]
            });
        });
    }
}
