const { MessageEmbed } = require("discord.js");
const randomColor = Math.floor(Math.random()*16777215).toString(16);


module.exports = {
    name: "channellogging",
    async execute(client) {
        // Function for getting audit logs cause it saves time to make it a function or somth idk.
        async function fetchAudit(type, guild) {
            const auditGuild = client.guilds.cache.get(guild);

            const auditLog = await auditGuild.fetchAuditLogs({
                limit: 1,
                type: type
            });

            return auditLog;
        }

        // Channel creation logs.
        client.on("channelCreate", async channel => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(channel.guild.id).log_channel_id);
            if (logChannel === undefined) return;

            const auditLog = await fetchAudit("CHANNEL_CREATE", channel.guild.id);
            const createLog = auditLog.entries.first();

            const { executor } = createLog; 

            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.tag} created a channel.`, iconURL: executor.avatarURL()})
                .addField("Channel name:", `${channel.toString()}`)
                .addField("Channel type:", `${channel.type}`)
                .addField("Voice channel?", `${channel.isVoice()}`)
                .addField("Created at:", `${channel.createdAt}`)
                .setColor(randomColor);

            logChannel.send({embeds: [embed]});
        });

        // Channel deletion logs.
        client.on("channelDelete", async channel => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(channel.guild.id).log_channel_id);
            if (logChannel === undefined) return;

            const auditLog = await fetchAudit("CHANNEL_DELETE", channel.guild.id);
            const deleteLog = auditLog.entries.first();

            const { executor } = deleteLog;
            
            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.tag} deleted a channel.`, iconURL: executor.avatarURL()})
                .addField("Channel name:", `${channel.toString()}`)
                .addField("Channel type:", `${channel.type}`)
                .addField("Voice channel?", `${channel.isVoice()}`)
                .addField("Created at:", `${channel.createdAt}`)
                .setColor(randomColor);

            logChannel.send({embeds: [embed]});
        });
    }
};