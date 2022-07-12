const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Sends a link to the dashboard."),
        
    async execute(interaction) {
        await interaction.reply(`https://dashboard.graveyardbot.xyz/`);
    },
};
