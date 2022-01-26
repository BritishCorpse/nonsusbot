const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "messagelogging",
    execute(client) {
        // Deleted message logging
        client.on("messageDelete", message => {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);

            const logChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username} deleted a message.`, message.author.avatarURL())
                .setColor(randomColor)
                .setDescription(message.content || "This message does not have any content, is a integrated message or embed.");

            logChannel.send({
                embeds: [embed]
            });
        });
    }
};
