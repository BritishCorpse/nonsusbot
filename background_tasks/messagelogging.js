const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "messagelogging",
    execute(client) {
        // Deleted message logging
        client.on("messageDelete", message => {
            var randomColor = Math.floor(Math.random()*16777215).toString(16);

            //This gives a shit ton of errors, also we dont theoretically need this, so im disabling it for now. We'll look into it later.
            //const channel = client.channels.cache.get("825726316817023016");
            const logChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setColor(randomColor)
                .setDescription(message.content);

            logChannel.send({
                embeds: [embed]
            });
        });
    }
}
