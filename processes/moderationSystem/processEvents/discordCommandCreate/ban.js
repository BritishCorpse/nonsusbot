const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["BAN_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the guild.")
        .addUserOption(option => option
            .setName("user")
            .setRequired(true)
            .setDescription("The user to ban"))
        .addBooleanOption(option => option
            .setName("deletemessages")
            .setRequired(true)
            .setDescription("Delete users previous messages"))
        .addStringOption(option => option
            .setName("reason")
            .setRequired(true)
            .setDescription("The reason to ban this user")),

    async execute({ data }) {
        const interaction = data.content;

        const userToBan = await interaction.options.getMember("user");
        const reason = await interaction.options.getString("reason");

        userToBan.ban({ reason });
        await interaction.editReply(`Banned ${userToBan} from ${interaction.guild.name} for \`${reason}\``);
    },
};
