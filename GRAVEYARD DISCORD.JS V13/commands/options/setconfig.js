const { SlashCommandBuilder } = require("@discordjs/builders");

const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions`);

module.exports = {
    requiredUserPermissions: ["MANAGE_GUILD"],
    requiredBotPermissions: ["MANAGE_GUILD"],
    
    data: new SlashCommandBuilder()
        .setName("setconfig")
        .setDescription("Set a config to be a particular value")
        .addSubcommand(subCommand => 
            subCommand
                .setName("booleans")
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
                .setName("channels")
                .setDescription("Set a channel config")
                .addStringOption(option =>
                    option
                        .setName("config")
                        .setDescription("The config to edit")
                        .setRequired(true)
                        .addChoices(
                            { name: "Logging Channel", value: "log_channel" },
                            { name: "Counting Channel", value: "counting_channel" },
                            { name: "Welcome Channel", value: "welcome_channel" },
                            { name: "Goodbye Channel", value: "goodbye_channel" },
                        )
                )
                .addChannelOption(option => option.setName("choice").setDescription("Please choose a channel.").setRequired(true))
        )
        .addSubcommand(subCommand => 
            subCommand
                .setName("numbers")
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
        .addSubcommand(subCommand =>
            subCommand
                .setName("text")
                .setDescription("Set a text config")
                .addStringOption(option => 
                    option
                        .setName("config")
                        .setDescription("The config to edit")
                        .setRequired(true)
                        .addChoices(
                            { name: "Welcome message", value: "welcome_message" },
                            { name: "Goodbye message", value: "goodbye_message"},
                            { name: "Welcome image URL", value: "welcome_image"},
                            { name: "Goodbye image URL", value: "goodbye_image"}
                        )
                )
                .addStringOption(option => option.setName("choice").setDescription("Enter the new text.").setRequired(true))
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const chosenConfig = await interaction.options.getString("config", true);

        let newConfig = ["test"];

        if (await interaction.options.getSubcommand() === "booleans") {
            const choice = await interaction.options.getBoolean("choice", true);

            newConfig = [choice, choice];
        }

        else if (await interaction.options.getSubcommand() === "channels") {
            const channel = interaction.options.getChannel("choice", true);

            newConfig = [`<#${channel.id}>`, channel.id];
        }

        else if (await interaction.options.getSubcommand() === "numbers") {
            const choice = await interaction.options.getInteger("choice", true);

            newConfig = [choice, choice];
        }

        else if (await interaction.options.getSubcommand() === "text") {
            const choice = await interaction.options.getString("choice", true);

            newConfig = [choice, choice];
        }

        // set the config
        interaction.client.serverConfig.get(interaction.guild.id)[chosenConfig] = newConfig;

        // write it to the file
        await saveServerConfig(interaction.client.serverConfig);

        await interaction.editReply(`Set the config \`${chosenConfig}\` to ${newConfig[0]}.`);
    }
};
