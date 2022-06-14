const { info } = require(`${__basedir}/configs/colors.json`);

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

module.exports = {
    name: "guildlogs",
    async execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            //* we return if detailedlogging is set to false
            const detailedLogging = await graveyard.serverConfig.get(interaction.guild.id).detailed_logging[1] || null;
            if (detailedLogging === null || detailedLogging === false) return;

            //* we return if the logchannel isn't defined. 
            if ((await graveyard.serverConfig.get(interaction.guild.id).log_channel[1] || null) === null) {
                return;   
            }

            const logChannel = await graveyard.channels.fetch(await graveyard.serverConfig.get(interaction.guild.id).log_channel[1]);

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