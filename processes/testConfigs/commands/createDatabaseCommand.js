const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testconfig")
        .setDescription("A command to test the config system."),

    async execute(interaction) {
        await interaction.reply("Tetsing");
    },
};
