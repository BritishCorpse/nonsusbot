const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "messagelogging",
    execute(client) {

        // Message update logging
        client.on("messageUpdate", async (oldMessage, newMessage) => {
            if (oldMessage.author.bot) return;

            let logChannel;
            if (client.serverConfig.get(oldMessage.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(oldMessage.guild.id).log_channel_id);
            }
            if (logChannel === undefined || !newMessage.content) return;

            const embed = new MessageEmbed()
                .setAuthor({name: `${oldMessage.author.tag} edited a message.`, iconURL: oldMessage.author.avatarURL()})
                .setColor("BLUE")
                .addField("Original message:", `${oldMessage.content || "This message is either integrated or an embed."}`)
                .addField("Updated message:", `${newMessage.content || "This message is either integrated or an embed."}`);
            
            logChannel.send({ embeds: [embed] });
        });


        // Deleted message logging
        client.on("messageDelete", async message => { 
            let logChannel;
            if (client.serverConfig.get(message.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).log_channel_id);
            }
            if (logChannel === undefined || !message.content) return;

            const auditLog = await message.channel.guild.fetchAuditLogs({
                limit: 1,
                type: "MESSAGE_DELETE"
            });

            const deleteLog = auditLog.entries.first();
            const { executor } = deleteLog; 

            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.username} deleted a message.`, iconURL: executor.avatarURL()})
                .setColor("RED")
                .addField("Message author:", `${message.author}`)
                .addField("Content:", `${message.content || "This message is either integrated or an embed."}`);

            logChannel.send({
                embeds: [embed]
            });
        });
    }
};
