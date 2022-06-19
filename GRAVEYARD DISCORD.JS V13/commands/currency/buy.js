const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item."),
        
    async execute(interaction) {
        await interaction.reply("Hey it's me!");
    },
};
