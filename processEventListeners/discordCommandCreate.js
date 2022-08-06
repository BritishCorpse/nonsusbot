module.exports = {
    name: "discordInteractionCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("interactionCreate", async interaction => {
            if (interaction.isChatInputCommand() === false) {
                return;
            }

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            await command.execute({ data: { content: interaction, globalUtilitiesFolder } });
        });
    },
};
