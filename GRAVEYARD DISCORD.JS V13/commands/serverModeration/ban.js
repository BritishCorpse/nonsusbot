const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban a user"),

    async execute(interaction) {
        await interaction.reply("Banned");
    }
};