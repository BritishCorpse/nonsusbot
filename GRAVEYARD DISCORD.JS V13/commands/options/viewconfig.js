const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("viewconfig")
        .setDescription("View what a config is set to")
        .addStringOption(option => 
            option
                .setName("config")
                .setDescription("The config to view")
                .setRequired(true)
                .addChoices(
                    { name: "Logging Channel", value: "log_channel" },
                    { name: "Counting Channel", value: "counting_channel" },
                    { name: "Welcome Channel", value: "welcome_channel" },
                    { name: "Goodbye Channel", value: "goodbye_channel" },
                    { name: "Remove bad words", value: "remove_bad_words" },
                    { name: "Remove all links in chat", value: "remove_links" },
                    { name: "Detailed logging", value: "detailed_logging" },
                    { name: "Remove non number messages in the counting channel", value: "remove_non_numbers_in_the_counting_channel" },
                    { name: "Normalize usernames that do not match the unicode standard", value: "normalize_non_unicode_names" },
                    { name: "Maximum word count", value: "max_word_count" },
                )
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const config = await interaction.options.getString("config");

        const writtenConfig = await interaction.client.serverConfig.get(interaction.guild.id)[config];

        await interaction.editReply(`The config \`${config}\` is set to the value ${writtenConfig[0] || "(Not set)"}.`);
    }
};