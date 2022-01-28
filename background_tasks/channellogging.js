const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "channellogging",
    async execute(client) {
        // Function for getting audit logs cause it saves time to make it a function or somth idk.
        async function fetchAudit(type, guild) {
            const auditGuild = await client.guilds.fetch(guild);

            const auditLog = await auditGuild.fetchAuditLogs({
                limit: 1,
                type: type
            });

            return auditLog;
        }

        // Channel creation logs.
        client.on("channelCreate", async channel => {
            let logChannel;
            if (client.serverConfig.get(channel.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(channel.guild.id).log_channel_id);
            }
            if (logChannel === undefined) return;

            const auditLog = await fetchAudit("CHANNEL_CREATE", channel.guild.id);
            const createLog = auditLog.entries.first();

            const { executor } = createLog; 

            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.tag} created a channel.`, iconURL: executor.avatarURL()})
                .addField("Channel name:", `${channel.toString()}`)
                .addField("Channel type:", `${channel.type}`)
                .addField("Voice channel:", `${channel.isVoice()}`)
                .addField("Created at:", `${channel.createdAt}`)
                .setColor("GREEN");

            logChannel.send({embeds: [embed]});
        });

        // Channel deletion logs.
        client.on("channelDelete", async channel => {
            let logChannel;
            if (client.serverConfig.get(channel.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(channel.guild.id).log_channel_id);
            }
            if (logChannel === undefined) return;

            const auditLog = await fetchAudit("CHANNEL_DELETE", channel.guild.id);
            const deleteLog = auditLog.entries.first();

            const { executor } = deleteLog;
            
            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.tag} deleted a channel.`, iconURL: executor.avatarURL()})
                .addField("Channel name:", `#${channel.name}`)
                .addField("Channel type:", `${channel.type}`)
                .addField("Voice channel:", `${channel.isVoice()}`)
                .addField("Created at:", `${channel.createdAt}`)
                .setColor("RED");

            logChannel.send({embeds: [embed]});
        });
    }
};
