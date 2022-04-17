//require things here
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

//do functions here
async function promptOptions(channel, user, promptMessage, options) {
    const rows = [];

    let index = 0;
    for (let i = 0; i < Math.min(Math.ceil(options.length / 25), 5); ++i) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dropdown${i}`)
                    .addOptions(options.slice(index, index + 25).map((option, j) => {
                        return {label: `${index + j + 1}. ${option}`, value: (index + j).toString()};
                    }))
            );
        rows.push(row);
        index += 25;
    }

    const message = await channel.send({
        content: promptMessage,
        components: rows
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector is below (but reduced it to 60 seconds)
    //const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});
    const collector = message.createMessageComponentCollector({filter, time: 60000});

    return new Promise((resolve, reject) => {
        collector.on("end", () => {
            reject(new Error("no option chosen"));

            rows.forEach(row => {
                row.components[0].setDisabled(true);
            });
            message.edit({components: rows});
        });

        collector.on("collect", async interaction => {
            resolve(Number.parseInt(interaction.values[0]));

            rows.forEach(row => {
                row.components[0].options.forEach(option => {
                    option.default = false;
                });
            });
            rows[Math.floor(Number.parseInt(interaction.values[0]) / 25)].components[0].options[Number.parseInt(interaction.values[0]) % 25].default = true;

            await interaction.update({components: rows});
            collector.stop();
        });
    });
}

//here are the configs that the promptConfig function will need.
const allConfigs = {
    "m_channel_id": "Spam Channel",
    "log_channel_id": "Log Channel",
    "verify_channel_id": "Verification Channel",
    "verify_role_id": "Verification Role",
    "welcome_channel_id": "Welcome Channel",
    "levelup_channel_id": "Leveling Channel",
    "suggestion_channel_id": "Receive Suggestions Channel",
    "send_suggestion_channel_id": "Send Suggestions Channel",
    "counting_channel_id": "Counting Channel",
    "prefix": "Prefix",
    "language": "Language",
    "detailed_logging": "In-depth Logging",
    "allow_illegal_names": "Simplify Names"
};

async function promptConfig(channel, user) {
    const configs = [];

    for (const key in defaultServerConfig) {
        configs.push(`${allConfigs[key]}`);
    }

    const optionChosen = await promptOptions(channel, user,
        "Choose an option:", configs);

    return configs[optionChosen];
}

async function promptConfigChannel(channel, user) {
    const allChannels = (await channel.guild.channels.fetch()).filter(channel => channel.type === "GUILD_TEXT");

    const optionChosen = await promptOptions(channel, user,
        "Choose the new channel:", allChannels.map(channel => `#${channel.name}`));
    
    return allChannels.at(optionChosen);
}


module.exports = {
    //all the functions
    promptConfig,
    promptConfigChannel,
};