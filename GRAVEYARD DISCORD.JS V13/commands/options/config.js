const { SlashCommandBuilder } = require("@discordjs/builders");

const { website_link } = require(`${__basedir}/configs/development_config.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Sends a link to the dashboard."),
        
    async execute(interaction) {
        await interaction.reply(`${website_link}dashboard`);
    },
};
