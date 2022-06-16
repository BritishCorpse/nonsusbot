const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reminder")
        .setDescription("Set a reminder so that you can be pinged for it later!"),
        
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
