const { SlashCommandBuilder } = require("@discordjs/builders");

const { makeEmbed } = require(`${__basedir}/utilities/generalFunctions.js`);

const { websiteLink, devServerLink } = require(`${__basedir}/configs/development_config.json`);

const { info } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show's a help embed with useful resources."),
        
    async execute(interaction) {
        await interaction.deferReply();

        const fields = [
            {
                name: "Website",
                value: `${websiteLink}`
            },
            {
                name: "Support Discord server",
                value: `${devServerLink}`
            },
            {
                name: "List of commands",
                value: `${websiteLink}/commands`
            },
            {
                name: "Got a question?",
                value: "Join the support server and make a ticket!"
            }
        ];

        await interaction.editReply({ embeds: [await makeEmbed(interaction.client, "Need help?", fields, info)] });
    },
};
