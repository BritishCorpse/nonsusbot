const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "eventlogging",
    async execute(client) {
        client.on("guildScheduledEventCreate", async guildEvent => {
            let logChannel;
            if (client.serverConfig.get(guildEvent.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(guildEvent.guild.id).log_channel_id);
            }
            if (logChannel === undefined) return;

            const creator = await client.users.fetch(guildEvent.creatorId);

            const eventDurationOriginal = guildEvent.scheduledEndTimestamp - guildEvent.scheduledStartTimestamp;
            let eventDuration = eventDurationOriginal / 3600000;

            if (eventDuration < 0) {
                eventDuration = "Event does not have a defined length.";
            }

            const embed = new MessageEmbed()
                .setAuthor({name: `${creator.username} created an event.`, iconURL: creator.avatarURL()})
                .addField("Event name:", `${guildEvent.name || "Event does not have a name."}`)
                .addField("Channel type:", `${guildEvent.channel || "Not in a channel."}`)
                .addField("Event description:", `${guildEvent.description || "No description provided."}`)
                .addField("Privacy level:", `${guildEvent.privacyLevel || "Privacy level non-existant."}`)
                .addField("Event URL:", `${guildEvent.url ||"No url."}`)
                .addField("Event status:", `${guildEvent.status || "No status found."}`)
                .addField("Starts at:", `${guildEvent.scheduledStartAt || "Event never started."}`)
                .addField("Event duration in hours:", `${eventDuration}`)
                .setColor("GREEN");

            logChannel.send({embeds: [embed]});
        });

        client.on("guildScheduledEventDelete", async guildEvent => {
            let logChannel;
            if (client.serverConfig.get(guildEvent.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(guildEvent.guild.id).log_channel_id);
            }
            if (logChannel === undefined) return;

            const auditLog = await guildEvent.guild.fetchAuditLogs({
                limit: 1,
                type: "GUILD_SCHEDULED_EVENT_DELETE"
            });

            const deleteLog = auditLog.entries.first();
            const { executor } = deleteLog; 

            const eventDurationOriginal = guildEvent.scheduledEndTimestamp - guildEvent.scheduledStartTimestamp;
            let eventDuration = eventDurationOriginal / 3600000;

            if (eventDuration < 0) {
                eventDuration = "Event does not have a defined length.";
            }

            const embed = new MessageEmbed()
                .setAuthor({name: `${executor.username} deleted an event.`, iconURL: executor.avatarURL()})
                .addField("Event name:", `${guildEvent.name || "Event did not have a name."}`)
                .addField("Channel:", `${guildEvent.channel || "Was not in a channel."}`)
                .addField("Event description:", `${guildEvent.description || "No description provided."}`)
                .addField("Event URL:", `${guildEvent.url ||"No url."}`)
                .addField("Event duration in hours:", `${eventDuration}`)
                .setColor("RED");

            logChannel.send({embeds: [embed]});
        });
    }
};
