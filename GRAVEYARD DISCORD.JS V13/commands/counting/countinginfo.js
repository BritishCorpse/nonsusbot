const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCountingGuild, getCountingUser } = require("../../db_objects");

const { Embed } = require("../../utilities/generalClasses.js");

const { info } = require("../../configs/colors.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("countinginfo")
        .setDescription("View counting information about a guild or user.")
        .addSubcommand(subcommand => 
            subcommand
                .setName("user")
                .setDescription("View counting information about a user")
                .addUserOption(option => option.setName("user").setDescription("The user to view information about").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("guild")
                .setDescription("View counting information about a guild")
        ),
        
    async execute(interaction) {
        await interaction.deferReply();

        if (await interaction.options.getSubcommand() === "guild") {
            const guild = await getCountingGuild(interaction.guild.id);

            const fields = [
                {
                    name: "Total numbers counted",
                    value: `${guild.correctlyCounted + guild.incorrectlyCounted}`
                },
                {
                    name: "Correctly counted numbers",
                    value: `${guild.correctlyCounted}`
                },
                {
                    name: "Incorrectly counted numbers",
                    value: `${guild.incorrectlyCounted}`
                }
            ];

            await interaction.editReply({ embeds: [new Embed(`${interaction.guild.name}'s counting info`, null, null, fields, null, info)] });
        }

        else if (await interaction.options.getSubcommand() === "user") {
            let user = await interaction.options.getUser("user");

            user = await getCountingUser(user.id);

            const fields = [
                {
                    name: "Total numbers counted",
                    value: `${user.correctlyCounted + user.incorrectlyCounted}`
                },
                {
                    name: "Correctly counted numbers",
                    value: `${user.correctlyCounted}`
                },
                {
                    name: "Incorrectly counted numbers",
                    value: `${user.incorrectlyCounted}`
                }
            ];

            await interaction.editReply({ embeds: [new Embed(`${await interaction.options.getUser("user").username}`, null, null, fields, null, info)] });
        }
    },
};
