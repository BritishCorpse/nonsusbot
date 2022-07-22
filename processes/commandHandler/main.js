const { InteractionType } = require("discord.js");

module.exports = {
    async execute(client, interaction) {
        if (interaction.type !== InteractionType.ApplicationCommand) return log("Skipped interaction which was not a command.");

        console.log(interaction.commandName);

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction);

        log(`${interaction.user.username} used the command ${command.commandName}`);
    }
};