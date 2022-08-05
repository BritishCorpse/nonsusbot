module.exports = {
    name: "discordInteractionCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("interactionCreate", async interaction => {
            if (interaction.isChatInputCommand() === false) {
                console.log("not a command");
                return;
            }

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.log("no command found");
                return;
            }

            await command.execute({ data: { content: interaction, globalUtilitiesFolder } });
        });
    },
};
