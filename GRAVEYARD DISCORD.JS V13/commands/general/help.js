const { SlashCommandBuilder } = require("@discordjs/builders");

const { makeEmbed } = require(`${__basedir}/utilities/generalFunctions.js`);

const { website_link, dev_server_invite_link } = require(`${__basedir}/configs/development_config.json`);

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
                value: `${website_link}`
            },
            {
                name: "Support Discord server",
                value: `${dev_server_invite_link}`
            },
            {
                name: "List of commands",
                value: `${website_link}commands`
            },
            {
                name: "Got a question?",
                value: "Join the support server and make a ticket!"
            }
        ];

        await interaction.editReply({ embeds: [await makeEmbed(interaction.client, "Need help?", fields, info)] });
    },
};
