const { InteractionType } = require("discord.js");

module.exports = {
    async execute(interaction) {
        if (interaction.type !== InteractionType.ApplicationCommand) return log("Skipped interaction which was not a command.");

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;


        // check for bot permission and user permissions here


        await command.execute(interaction);

        log(`${interaction.user.username} used the command ${interaction.commandName}`);
    }
};