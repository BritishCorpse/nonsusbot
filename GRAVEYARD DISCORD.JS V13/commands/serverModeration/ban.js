const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    requiredUserPermissions: ["BAN_USERS"],
    requiredBotPermissions: ["BAN_USERS"],

    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the guild")
        .addUserOption(option => option.setName("member").setDescription("The member to ban from the guild").setRequired(true))
        .addIntegerOption(option => option.setName("duration").setDescription("The duration of the ban (no duration = permanent)"))
        .addStringOption(option => option.setName("reason").setDescription("The reason to ban this member")),

    async execute(interaction) {
        await interaction.getMember("member").ban(await interaction.getInteger("duration") || "0", await interaction.getString("reason") || "Banned by a moderator.");
    }
};