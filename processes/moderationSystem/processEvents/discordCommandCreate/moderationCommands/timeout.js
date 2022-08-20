const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeouts a user in the guild.")
        .addUserOption(option => option
            .setName("user")
            .setRequired(true)
            .setDescription("The user to timeout"))
        .addStringOption(option => option
            .setName("reason")
            .setRequired(true)
            .setDescription("The reason to ban this user"))
        .addStringOption(option => option
            .setName("duration")
            .setRequired(true)
            .setDescription("How long to timeout this member for")
            .addChoices(
                { name: "A minute", value: "60000" },
                { name: "Five minutes", value: "300000" },
                { name: "Ten minutes", value: "600000" },
                { name: "An hour", value: "3600000" },
                { name: "A day", value: "86400000" },
                { name: "A Week", value: "604800000" },
            )),

    async execute({ data }) {
        const interaction = data.content;

        const memberToTimeout = await interaction.options.getMember("user");
        const reason = await interaction.options.getString("reason");
        const duration = parseInt(await interaction.options.getString("duration"));

        memberToTimeout.timeout(duration, reason);

        await interaction.editReply(`Timed out ${memberToTimeout}. Duration: ${duration} Reason: \`${reason}\``);
    },
};
