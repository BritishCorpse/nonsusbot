const { MessageEmbed } = require("discord.js");

function formatBacktick(name) {
    return `\`\`${name}\`\``;
}

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

async function makeEmbed(graveyard, title, fields, color, image) {
    return new MessageEmbed({
        title: title,

        fields: fields,

        author: {
            name: "Graveyard",
            icon_url: `${graveyard.user.avatarURL()}`,
            url: "https://talloween.github.io/graveyardbot/",
        },

        color: color,

        timestamp: new Date(),

        footer: {
            text: "Powered by Mana Potions",
        },

        image: {
            url: image,
        },
    });
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

    const embed = await makeEmbed(graveyard, title, fields, color, image, logType);

    await sendLog(embed, logChannel);
}

module.exports = {
    formatBacktick,
    makeEmbed,
    sendGuildLog
};