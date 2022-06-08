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
                    { name: "Where your will receive logged information about this server", value: "log_channel" },
                    { name: "Where server members will count n+1 until someone fails and the count is reset", value: "counting_channel" },
                    { name: "Where a message will be sent every time a user joins the server", value: "welcome_channel" },
                    { name: "Where a message will be sent every time a user leaves the server", value: "goodbye_channel" },
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

        await interaction.editReply(`The config \`${config}\` is set to the value ${writtenConfig || "(Not set)"}.`);
    }
};