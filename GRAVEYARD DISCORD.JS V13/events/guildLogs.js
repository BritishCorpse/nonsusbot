const { info } = require(`${__basedir}/configs/colors.json`);

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

async function checkLogChannel(graveyard, guildId) {
    const logChannel = await graveyard.serverConfig.get(guildId).log_channel[1];

    if (logChannel === null) return false;
    else return logChannel;
}

async function checkDetailedLogging(graveyard, guildId) {
    const detailedLogging = await graveyard.serverConfig.get(guildId).detailed_logging[1];

    if (detailedLogging === null || detailedLogging === false) return false;
    else return true;
}

module.exports = {
    name: "guildlogs",
    async execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            //* we return if detailedlogging is set to false
            const detailedLogging = await checkDetailedLogging(graveyard, interaction.guild.id);
            if (detailedLogging === false) return;

            //* we return if the logchannel isn't defined.
            let logChannel = await checkLogChannel(graveyard, interaction.guild.id);
            if (logChannel === null) return;

            logChannel = await graveyard.channels.fetch(graveyard.serverConfig.get(interaction.guild.id).log_channel[1]);

            const embed = {
                title: "User iniated an application command.",
                fields: [
                    {
                        name: "Executor",
                        value: `${await interaction.user.tag}`
                    },
                    {
                        name: "Command name",
                        value: `${await interaction.commandName}`
                    },
                    {
                        name: "Channel",
                        value: `${await interaction.channel}`
                    }
                ],
                timestamp: new Date(),
                color: info
            };

            await sendLog(embed, logChannel);
        });
    }
};