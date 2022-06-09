const { SlashCommandBuilder } = require("@discordjs/builders");

const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setconfig")
        .setDescription("Set a config to be a particular value")
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
        ),

    async execute(interaction) {
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
};