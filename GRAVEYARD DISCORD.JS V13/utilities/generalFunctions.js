const { Embed } = require("./generalClasses");

function formatBacktick(name) {
    return `\`\`${name}\`\``;
}

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

async function sendGuildLog(graveyard, title, fields, color, image, logType, guild) {
    //* we return if detailedlogging is set to false
    const detailedLogging = await graveyard.serverConfig.get(guild.id).logType || null;
    if (detailedLogging === null || detailedLogging === false) return;

    //* we return if the logchannel isn't defined. 
    if ((await graveyard.serverConfig.get(guild.id).log_channel[1] || null) === null) {
        return;   
    }

    const logChannel = await graveyard.channels.fetch(await graveyard.serverConfig.get(guild.id).log_channel[1]);

    const embed = new Embed(title, null, logType, fields, image, color, "Logger");

    await sendLog(embed, logChannel);
}

module.exports = {
    formatBacktick,
    sendGuildLog,
};