const { SlashCommandBuilder } = require("@discordjs/builders");

const guildModerationHistories = require("../../../processDatabaseSchemas/guildModerationHistories");

const { info } = require("../../../../../sources/colours.json");

module.exports = {
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: ["MANAGE_GUILD"],

    data: new SlashCommandBuilder()
        .setName("guildmoderationinfo")
        .setDescription("See moderation info about your guild."),

    async execute({ data }) {
        const interaction = data.content;

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();
        const embedManager = new data.globalUtilitiesFolder.EmbedManager();

        const guild = await databaseManager.find(guildModerationHistories, {
            guildId: interaction.guild.id,
        }, true) || null;

        const fields = [
            {
                name: "Total warnings",
                value: `${guild.totalWarnings}`,
            },
            {
                name: "Total bans",
                value: `${guild.totalBans}`,
            },
        ];

        await embedManager.createEmbed(`${interaction.guild.name}`, null, fields, null, null, info.decimal, null);

        await interaction.editReply({ embeds: embedManager.embeds });
    },
};
