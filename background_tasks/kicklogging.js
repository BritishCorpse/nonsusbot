const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kicklogging",
    async execute(client) {
        client.on("guildMemberRemove", async (guildMember) => {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);

            // Find the audit log that has the information that we need.
            const auditLog = await guildMember.guild.fetchAuditLogs({
                limit: 1,
                type: "MEMBER_KICK",
            });
        
            const kickLog = auditLog.entries.first();

            const { target, executor, reason } = kickLog; 

            // Define log channel, if it doesnt exist return, else send the ban log.
            let logChannel;
            if (client.serverConfig.get(guildMember.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(guildMember.guild.id).log_channel_id);
            }
            if (logChannel === undefined) return;

            //Make sure that the audit log entry exists.
            if (!kickLog) return;

            const embed = new MessageEmbed()
                .setTitle(`User ${guildMember.displayName} was kicked from ${guildMember.guild.name}.`)
                .setColor(randomColor);

            if (guildMember.user.id === target.id) embed.setDescription(`Reason for ban: ${reason || "No reason provided."} \n Banned by ${executor}`);

            console.log(reason);
            logChannel.send({embeds: [embed]});
        });
    }
};
