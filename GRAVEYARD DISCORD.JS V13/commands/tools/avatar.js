const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Send someone's avatar in chat.")
        .addUserOption(option => 
            option.setName("user").setDescription("The user who's avatar you want to see").setRequired(true)
        ),
        
    async execute(interaction) {
        const user = await interaction.options.getUser("user");

        await interaction.reply(user.avatarURL({ format: "png", size: 1024 }));
    },
};
