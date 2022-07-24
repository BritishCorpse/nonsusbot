const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("A test command you can use to check that the bot is responding."),

    async execute(interaction) {
        await interaction.reply("lorem ipsum");
    },
};
