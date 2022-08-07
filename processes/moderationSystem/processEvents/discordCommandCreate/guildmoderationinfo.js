const { SlashCommandBuilder } = require("@discordjs/builders");

const guildModerationHistories = require("../../processDatabaseSchemas/guildModerationHistories");

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

        await embedManager.createEmbed(`${interaction.guild.name}`, null, fields, null, null, "16777215", null);

        await embedManager.addChannel(interaction.channel);

        embedManager.sendEmbeds(embedManager.embeds);

        await interaction.editReply("Here's moderation information about your guild.");
    },
};
