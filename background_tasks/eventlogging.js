const { MessageEmbed } = require("discord.js");
const randomColor = Math.floor(Math.random()*16777215).toString(16);

module.exports = {
    name: "eventlogging",
    async execute(client) {
        client.on("guildScheduledEventCreate", async guildEvent => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(guildEvent.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const creator = client.users.cache.get(guildEvent.creatorId);
            console.log(creator);

            const embed = new MessageEmbed()
                .setAuthor({name: `${await creator.username} created an event.`, iconURL: creator.avatarURL()})
                .addField("Event name:", `${guildEvent.name || "Event does not have a name."}`)
                .addField("Channel type:", `${guildEvent.channel || "Not in a channel."}`)
                .addField("Event description:", `${guildEvent.description || "No description provided."}`)
                .addField("Privacy level:", `${guildEvent.privacyLevel || "Privacy level non-existant."}`)
                .addField("Event URL:", `${guildEvent.url ||"No url."}`)
                .addField("Event status:", `${guildEvent.status || "No status found."}`)
                .addField("Start and end times:", `${guildEvent.scheduledStartAt || "Event never started."} to ${guildEvent.scheduledEndAt || "Event never ended."}`)
                .addField("Event duration in hours:", `${guildEvent.scheduledEndTimestamp - guildEvent.scheduledStartTimestamp / 3600000}`)
                .setColor(randomColor);

            logChannel.send({embeds: [embed]});
        });

        client.on("guildScheduledEventDelete", async guildEvent => {
            const logChannel = client.channels.cache.get(client.serverConfig.get(guildEvent.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            const creator = client.users.cache.get(guildEvent.creatorId);

            const embed = new MessageEmbed()
                .setAuthor({name: `${await creator.username} deleted an event.`, iconURL: creator.avatarURL()})
                .addField("Event name:", `${guildEvent.name || "Event did not have a name."}`)
                .addField("Channel type:", `${guildEvent.channel || "Was not in a channel."}`)
                .addField("Event description:", `${guildEvent.description || "No description provided."}`)
                .addField("Privacy level:", `${guildEvent.privacyLevel || "Privacy level was non-existant."}`)
                .addField("Event URL:", `${guildEvent.url ||"No url."}`)
                .addField("Event status:", `${guildEvent.status || "No status found."}`)
                .addField("Start and end times:", `${guildEvent.scheduledStartAt || "Event never started."} to ${guildEvent.scheduledEndAt || "Event never ended."}`)
                .addField("Event duration in hours:", `${guildEvent.scheduledEndTimestamp - guildEvent.scheduledStartTimestamp / 3600000}`)
                .setColor(randomColor);

            logChannel.send({embeds: [embed]});
        });
    }
};