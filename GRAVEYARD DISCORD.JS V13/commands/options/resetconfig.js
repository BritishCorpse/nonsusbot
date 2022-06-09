const { SlashCommandBuilder } = require("@discordjs/builders");

const defaultServerConfig = require(`${__basedir}/configs/default_server_config.json`);

const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions`);


module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetconfig")
        .setDescription("Reset a configs value")
        .addSubcommand(subCommand => 
            subCommand
                .setName("boolean_configs")
                .setDescription("Reset a true/false config")
                .addStringOption(option =>
                    option
                        .setName("config")
                        .setDescription("The config to reset")
                        .setRequired(true)
                        .addChoices(
                            { name: "Remove bad words", value: "remove_bad_words" },
                            { name: "Remove all links in chat", value: "remove_links" },
                            { name: "Detailed logging", value: "detailed_logging" },
                            { name: "Remove non number messages in the counting channel", value: "remove_non_numbers_in_the_counting_channel" },
                            { name: "Normalize usernames that do not match the unicode standard", value: "normalize_non_unicode_names" },
                        )
                )
        )
        .addSubcommand(subCommand => 
            subCommand
                .setName("channel_configs")
                .setDescription("Reset a channel config")
                .addStringOption(option =>
                    option
                        .setName("config")
                        .setDescription("The config to reset")
                        .setRequired(true)
                        .addChoices(
                            { name: "Where your will receive logged information about this server", value: "log_channel" },
                            { name: "Where server members will count n+1 until someone fails and the count is reset", value: "counting_channel" },
                            { name: "Where a message will be sent every time a user joins the server", value: "welcome_channel" },
                            { name: "Where a message will be sent every time a user leaves the server", value: "goodbye_channel" },
                        )
                )
        )
        .addSubcommand(subCommand => 
            subCommand
                .setName("number_configs")
                .setDescription("Reset a number config")
                .addStringOption(option =>
                    option
                        .setName("config")
                        .setDescription("The config to reset")
                        .setRequired(true)
                        .addChoices(
                            { name: "Maximum word count", value: "max_word_count" },
                        )
                )
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const config = await interaction.options.getString("config");

        // set the config
        interaction.client.serverConfig.get(interaction.guild.id)[config] = defaultServerConfig[config];

        // write it to the file
        saveServerConfig(interaction.client.serverConfig);

        await interaction.editReply(`Reset the config \`${await interaction.options.getString("config")}\`.`);
    }
};