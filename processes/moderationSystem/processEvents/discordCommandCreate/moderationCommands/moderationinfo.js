const { SlashCommandBuilder } = require("@discordjs/builders");

const guildMemberModerationHistory = require("../../../processDatabaseSchemas/guildMemberModerationHistories");

module.exports = {
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("moderationinfo")
        .setDescription("See moderation info on guild members.")
        .addUserOption(option => option
            .setName("user")
            .setRequired(true)
            .setDescription("The user to view")),

    async execute({ data }) {
        const interaction = data.content;

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();
        const embedManager = new data.globalUtilitiesFolder.EmbedManager();

        const user = await databaseManager.find(guildMemberModerationHistory, {
            guildId: interaction.guild.id,
            userId: await interaction.options.getUser("user").id,
        }, true) || null;

        const fields = [
            {
                name: "Banned?",
                value: `${user.isBanned}`,
            },
            {
                name: "Muted?",
                value: `${user.isMuted}`,
            },
            {
                name: "Times muted",
                value: `${user.timesMuted}`,
            },
            {
                name: "Times banned",
                value: `${user.timesBanned}`,
            },
        ];

        await embedManager.createEmbed(`${await interaction.options.getUser("user").tag}`, null, fields, null, null, "16777215", null);

        await embedManager.addChannel(interaction.channel);

        embedManager.sendEmbeds(embedManager.embeds);

        await interaction.editReply(`${await interaction.options.getMember("user")}`);
    },
};
