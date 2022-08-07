const { SlashCommandBuilder } = require("@discordjs/builders");

const guildMemberModerationHistories = require("../../processDatabaseSchemas/guildMemberModerationHistories");

module.exports = {
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["BAN_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unbans a user from the guild.")
        .addNumberOption(option => option
            .setName("user")
            .setRequired(true)
            .setDescription("The user id to unban"))
        .addStringOption(option => option
            .setName("reason")
            .setRequired(true)
            .setDescription("The reason to unban this user")),

    async execute({ data }) {
        const interaction = data.content;

        const userToUnban = await interaction.options.getNumber("user");
        const reason = await interaction.options.getString("reason");

        interaction.guild.bans.remove(userToUnban, [reason]).catch(() => {
            return interaction.editReply("Not a valid user id.");
        });

        await interaction.editReply(`Unbanned ${userToUnban}.`);

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        const userInDb = await databaseManager.find(guildMemberModerationHistories, {
            guildId: interaction.guild.id,
            userId: await interaction.options.getUser("user").id,
        }, true) || null;

        userInDb.isBanned = false;

        await userInDb.save();
    },
};
