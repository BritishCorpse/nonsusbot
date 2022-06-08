const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    requiredUserPermissions: ["KICK_USERS"],
    requiredBotPermissions: ["KICK_USERS"],
    
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the guild")
        .addMemberOption(option => option.setName("member").setDescription("The member to kick from the guild").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason to kick this member")),

    async execute(interaction) {
        await interaction.getMember("member").kick(await interaction.getString("reason") || "Kicked by a moderator.");

    }
};