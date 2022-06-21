const { SlashCommandBuilder } = require("@discordjs/builders");

const defaultServerConfig = require(`${__basedir}/configs/default_server_config.json`);

const { saveServerConfig } = require(`${__basedir}/utilities/configFunctions`);


module.exports = {
    requiredUserPermissions: ["MANAGE_GUILD"],
    requiredBotPermissions: ["MANAGE_GUILD"],

    data: new SlashCommandBuilder()
        .setName("resetconfig")
        .setDescription("Reset a configs value")
        .addStringOption(option => 
            option
                .setName("config")
                .setDescription("The config to reset")
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
                    { name: "Welcome message", value: "welcome_message" },
                    { name: "Goodbye message", value: "goodbye_message" },
                    { name: "Welcome image URL", value: "welcome_image" },
                    { name: "Goodbye image URL", value: "goodbye_image" }
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
