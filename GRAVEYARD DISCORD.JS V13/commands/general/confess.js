const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confess")
        .setDescription("Confess to a confess channel, if there is one available.")
        .addStringOption(option => option.setName("confession").setDescription("Your confession").setRequired(true)),
        
    async execute(interaction) {
        await interaction.deferReply();
        
        const confessionChannel = await interaction.client.serverConfig.get(interaction.guild.id).confession_channel[1] || null;

        if (confessionChannel === null) return interaction.editReply({ content: "No confession channel was found.", ephemeral: true });
    },
};
