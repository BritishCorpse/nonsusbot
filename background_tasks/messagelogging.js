const { MessageEmbed } = require("discord.js");
const randomColor = Math.floor(Math.random()*16777215).toString(16);

module.exports = {
    name: "messagelogging",
    execute(client) {

        // Message update logging
        client.on("messageUpdate", (oldMessage, newMessage) => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(oldMessage.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const embed = new MessageEmbed()
                .setAuthor(`${oldMessage.author.tag} edited a message.`, oldMessage.author.avatarURL())
                .setColor(randomColor)
                .setDescription(
                    `Original message content: ${oldMessage.content || "This message does not have any content, is an integrated message or embed."}\nEdited message content: ${newMessage.content || "This message does not have any content, is a integrated message or embed."}`
                );
            
            logChannel.send({ embeds: [embed] });
        });


        // Deleted message logging
        client.on("messageDelete", message => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.author.tag} deleted a message.`, message.author.avatarURL())
                .setColor(randomColor)
                .setDescription(message.content || "This message does not have any content, is an integrated message or embed.");

            logChannel.send({
                embeds: [embed]
            });
        });
    }
};
