const { SlashCommandBuilder } = require("@discordjs/builders");

const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");

const { info } = require("../../../../sources/colours.json");

module.exports = {
    userPermissions: ["VIEW_MESSAGES"],
    botPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Comprehensive system for server moderation"),

    async execute({ data }) {
        const interaction = data.content;

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();
        const embedManager = new data.globalUtilitiesFolder.EmbedManager();

        const guildConfigs = await databaseManager.find(guildAutoModerationConfigs, {
            guildId: interaction.guild.id,
        }, true);

        const spamFilter = guildConfigs.options.spamFilter;

        const spamFilterEmbeds = [
            {
                name: "Enabled?",
                value: `${spamFilter.isEnabled}`,
            },

            {
                name: "Message amount",
                value: `${spamFilter.messageAmount}`,
            },

            {
                name: "Interval",
                value: `${spamFilter.duration} per ${spamFilter.durationType}`,
            },
        ];

        embedManager.createEmbed("Spam filter", null, spamFilterEmbeds, null, null, info.decimal, "Auto Moderator");

        await interaction.editReply({ embeds: embedManager.embeds });
    },
};
