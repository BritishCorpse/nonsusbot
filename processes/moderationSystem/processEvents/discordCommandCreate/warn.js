const { SlashCommandBuilder } = require("@discordjs/builders");

const guildMemberWarnings = require("../../processDatabaseSchemas/guildMemberWarnings");
const guildModerationHistories = require("../../processDatabaseSchemas/guildModerationHistories");

module.exports = {
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Give a user a warn")
        .addUserOption(option => option
            .setName("user")
            .setRequired(true)
            .setDescription("The user to warn"))
        .addStringOption(option => option
            .setName("reason")
            .setRequired(true)
            .setDescription("The reason to warn this user")),

    async execute({ data }) {
        const interaction = data.content;

        const userToWarn = await interaction.options.getMember("user");
        const reason = await interaction.options.getString("reason");

        await interaction.editReply(`Gave ${userToWarn} a warning for \`${reason}\``);

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        const guildInDb = await databaseManager.find(guildModerationHistories, {
            guildId: interaction.guild.id,
        }, true);

        guildInDb.totalWarns += 1;
        await guildInDb.save();

        databaseManager.create(guildMemberWarnings, {
            guildId: interaction.guild.id,
            userId: await interaction.options.getUser("user").id,
            reason: await interaction.optoins.getString("reason"),
            warningId: guildInDb.totalWarns,
        }, true);
    },
};
