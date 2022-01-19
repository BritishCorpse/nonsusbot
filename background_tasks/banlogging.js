const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "banlogging",
    execute(client) {
        // Deleted message logging
        client.on("guildBanAdd", async (ban) => {
            // Decide random colour for the embed that's nice an aethetic.
            const randomColor = Math.floor(Math.random()*16777215).toString(16);

            // Find the audit log that has the information that we need.
            const auditLog = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: "GUILD_BAN_ADD",
            });
        
            const banLog = auditLog.entries.first();

            const { target, executor, reason } = banLog; 

            // Define log channel, if it doesnt exist return, else send the ban log.
            const logChannel = client.channels.cache.get(client.serverConfig.get(ban.guild.id).log_channel_id);

            if (logChannel === undefined) return;

            //Make sure that the audit log entry exists.
            if (!banLog) return logChannel.send(`${ban.user} was banned from ${ban.guild} but the reason and executor are not determined due to the audit search returning inconclusive.`);

            // Declare embeds existance. (Very useful comment :D)
            const embed = new MessageEmbed()
                .setTitle(`User ${ban.user.username} was banned from ${ban.guild.name}`)
                .setColor(randomColor);

            if (ban.user.id === target.id) embed.setDescription(`Reason for ban: ${reason || "No reason provided"} \n Banned by ${executor}`);

            else embed.setDescription("Reason for ban: Undefined.");

            logChannel.send({ embeds: [embed] });
        });
    }
};
