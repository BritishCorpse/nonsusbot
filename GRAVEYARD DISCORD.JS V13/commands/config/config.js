const { SlashCommandBuilder } = require("@discordjs/builders");
const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions`);

const defaultServerConfig = require(`${__basedir}/default_server_config.json`);

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Edit your guild's configs!!")
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName("set")
                .setDescription("Set a config")
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("boolean_configs")
                        .setDescription("Set a boolean config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Remove bad words", value: "remove_bad_words" },
                                    { name: "Remove all links in chat", value: "remove_links" },
                                    { name: "Detailed logging", value: "detailed_logging" },
                                    { name: "Remove non number messages in the counting channel", value: "remove_non_numbers_in_the_counting_channel" },
                                    { name: "Normalize usernames that do not match the unicode standard", value: "normalize_non_unicode_names" },
                                )
                        )
                        .addBooleanOption(option => option.setName("choice").setDescription("Please choose either true or false.").setRequired(true))
                )
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("channel_configs")
                        .setDescription("Set a channel config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Where your will receive logged information about this server", value: "log_channel" },
                                    { name: "Where server members will count n+1 until someone fails and the count is reset", value: "counting_channel" },
                                    { name: "Where a message will be sent every time a user joins the server", value: "welcome_channel" },
                                    { name: "Where a message will be sent every time a user leaves the server", value: "goodbye_channel" },
                                )
                        )
                        .addChannelOption(option => option.setName("choice").setDescription("Please choose a channel.").setRequired(true))
                )
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("number_configs")
                        .setDescription("Set a number config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Maximum word count", value: "max_word_count" },
                                )
                        )
                        .addIntegerOption(option => option.setName("choice").setDescription("Please choose either true or false.").setRequired(true))
                )
        )

        //reset config
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName("reset")
                .setDescription("Set a config")
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("boolean_configs")
                        .setDescription("Set a boolean config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
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
                        .setDescription("Set a channel config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
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
                        .setDescription("Set a number config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Maximum word count", value: "max_word_count" },
                                )
                        )
                )
        )

        //view a config
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName("view")
                .setDescription("View a config")
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("boolean_configs")
                        .setDescription("Set a boolean config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
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
                        .setDescription("Set a channel config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Where your server will receive logged information about this server", value: "log_channel" },
                                    { name: "Where server members will count n+1 until someone fails and the count is reset", value: "counting_channel" },
                                    { name: "Where a message will be sent every time a user joins the server", value: "welcome_channel" },
                                    { name: "Where a message will be sent every time a user leaves the server", value: "goodbye_channel" },
                                )
                        )
                )
                .addSubcommand(subCommand => 
                    subCommand
                        .setName("number_configs")
                        .setDescription("Set a number config")
                        .addStringOption(option =>
                            option
                                .setName("config")
                                .setDescription("The config to edit")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Maximum word count", value: "max_word_count" },
                                )
                        )
                )
        ),

    async execute(interaction) {
        if (await interaction.options.getSubcommandGroup() === "reset") {
            await interaction.deferReply();

            const config = await interaction.options.getString("config");

            // set the config
            interaction.client.serverConfig.get(interaction.guild.id)[config] = defaultServerConfig[config];

            // write it to the file
            saveServerConfig(interaction.client.serverConfig);

            await interaction.editReply(`Reset the config \`${await interaction.options.getString("config")}\`.`);
        } 

        else if (await interaction.options.getSubcommandGroup() === "view") {
            await interaction.deferReply();

            const config = await interaction.options.getString("config");

            const writtenConfig = await interaction.client.serverConfig.get(interaction.guild.id)[config];

            await interaction.editReply(`The config \`${config}\` is set to the value ${writtenConfig || "(Not set)"}.`);
        }

        else if (await interaction.options.getSubcommandGroup() === "set") {     
            await interaction.deferReply();

            const chosenConfig = await interaction.options.getString("config", true);

            let newConfig;

            if (await interaction.options.getSubcommand() === "boolean_configs") {
                newConfig = await interaction.options.getBoolean("choice", true);
            }

            else if (await interaction.options.getSubcommand() === "channel_configs") {
                newConfig = await interaction.options.getChannel("choice", true);
            }

            else if (await interaction.options.getSubcommand() === "number_configs") {
                newConfig = await interaction.options.getInteger("choice", true);
            }

            // set the config
            interaction.client.serverConfig.get(interaction.guild.id)[chosenConfig] = newConfig;

            // write it to the file
            await saveServerConfig(interaction.client.serverConfig);

            await interaction.editReply(`Set the config \`${chosenConfig}\` to ${newConfig}.`);
        }
    },
};
