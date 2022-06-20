const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    requiredUserPermissions: ["BAN_USERS"],
    requiredBotPermissions: ["BAN_USERS"],

    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the guild")
        .addUserOption(option => option.setName("member").setDescription("The member to ban from the guild").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason to ban this member").setRequired(true)),

    async execute(interaction) {
        const guildMember = await interaction.getMember("member");
        const reason = await interaction.getString("reason");

        if (guildMember.moderatable === false) return await interaction.reply({ content: "I cannot moderate this member.", ephemeral: true });

        guildMember.ban({ reason: reason });

        await interaction.reply(`Banned ${guildMember} from the guild.`);}
};