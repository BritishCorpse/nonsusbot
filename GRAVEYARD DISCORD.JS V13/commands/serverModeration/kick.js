const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    requiredUserPermissions: ["KICK_USERS"],
    requiredBotPermissions: ["KICK_USERS"],
    
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the guild")
        .addUserOption(option => option.setName("member").setDescription("The member to kick from the guild").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason to kick this member").setRequired(true)),

    async execute(interaction) {
        const guildMember = await interaction.getMember("member");

        if (guildMember.moderatable === false) return await interaction.reply({ content: "I cannot moderate this member.", ephemeral: true });

        guildMember.kick(await interaction.getString("reason"));

        await interaction.reply(`Kicked ${guildMember} from the guild.`);
    }
};
