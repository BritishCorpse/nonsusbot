const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createdatabase")
        .setDescription("A test command you can use to check that the bot is responding."),

    async execute({ data }) {
        const interaction = data.content;

        await interaction.reply("lorem ipsum");
    },
};
