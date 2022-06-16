const { info } = require(`${__basedir}/configs/colors.json`);

const { websiteLink } = require(`${__basedir}/configs/development_config.json`);

const { formatBacktick } = require(`${__basedir}/utilities/generalFunctions.js`);

const { log } = require(`${__basedir}/utilities/botLogFunctions.js`);

const { missingPermissions } = require(`${__basedir}/utilities/commandFunctions.js`);

async function sendLog(embed, channel) {
    await channel.send({ embeds: [embed] });
}

async function sendGuildLog(graveyard, interaction) {
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
}

module.exports = {
    name: "commandinteractioncreate",
    async execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            //* only accept command interactions
            // this file only handles command interactions
            if (!interaction.isCommand()) return;

            //
            //! Command execution
            //

            //* finds the command in the collection
            // returns if the command is not found
            const command = graveyard.commands.get(interaction.commandName);
            if (!command) return;

            //* check member permissions
            // if the member is missing permissions, tell them what permissions theyre missing and end the execution
            const isMissingPermissions = await missingPermissions(interaction.member, interaction, command);
            if (await isMissingPermissions !== false) {
                await interaction.reply(`You do not have these required permissions in this channel or server: ${isMissingPermissions.map(formatBacktick).join(", ")}`);
            }

            

            //* check for bot permissions
            // if im missing permissions, tell them what permissions im missing and end the execution
            const isBotMissingPermissions = await missingPermissions(interaction.guild.me, interaction, command);
            if (isBotMissingPermissions !== false) {
                await interaction.reply(`I do not have these required permissions in this channel or server: ${isBotMissingPermissions.map(formatBacktick).join(", ")}`);
            }

            //* execute the command
            // if command execution fails, log the error and send them an ephemeral reply stating to go contact support.
            await command.execute(interaction).catch(async () => {
                await interaction.reply({ content: `An error occured. Please wait until trying this command again. If this error persists, please contact support at ${websiteLink}/contact.html`, ephemeral: true });
            });

            //
            //! Logging
            //

            //* send a log to the guild
            await sendGuildLog(graveyard, interaction);

            //* log the command to server logs
            await log(`In the guild ${interaction.guild.name}, ${interaction.user.tag} used the command ${interaction.commandName} with the options {${await interaction.options.data.map(option => ` NAME: [${option.name}] VALUE: [${option.value}]`) || "No options"} }`);

        });
    }
};