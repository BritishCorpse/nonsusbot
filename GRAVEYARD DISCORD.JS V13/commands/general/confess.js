const { SlashCommandBuilder } = require("@discordjs/builders");

const { Embed } = require("../../utilities/generalClasses.js");

const { info } = require("../../configs/colors.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("confess")
        .setDescription("Confess to a confess channel, if there is one available.")
        .addStringOption(option => option.setName("confession").setDescription("Your confession").setRequired(true)),
        
    async execute(interaction) {
        await interaction.Reply({ content: "Sending confession!", ephemeral: true });
        
        const confessionChannel = await interaction.client.serverConfig.get(interaction.guild.id).confession_channel[1] || null;

        if (confessionChannel === null) return interaction.followUp({ content: "No confession channel was found.", ephemeral: true });

        const confessionEmbed = new Embed("Confession", `${interaction.getString("confession")}`, "This confession was sent anonymously", null, null, info);

        confessionChannel.send({ embeds: [confessionEmbed] });
    },
};
