const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    requiredBotPermissions: ["MANAGE_MESSAGES"],
    requiredUserPermissions: ["MANAGE_MESSAGES"],

    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Bulk delete messages from a channel.")
        .addChannelOption(option => option.setName("channel").setDescription("The channel where to purge messages").setRequired(true))
        .addIntegerOption(option => option.setName("amount").setDescription("The amount of messages to purge").setRequired(true).setMinValue(1).setMaxValue(99)),
    async execute(interaction) {
        const channel = await interaction.options.getChannel("channel");

        const amount = await interaction.options.getInteger("amount");

        await interaction.reply(`Deleted ${amount} messages in the ${channel} channel.`);

        return await channel.bulkDelete(amount + 1);
    },
};
