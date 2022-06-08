const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    developerOnly: true,
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    
    async execute(interaction) {
        await interaction.reply("Test successful.");
    }
};