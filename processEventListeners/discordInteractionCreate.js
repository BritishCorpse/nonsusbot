module.exports = {
    name: "discordInteractionCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("interactionCreate", interaction => {
            const { ProcessManager } = globalUtilitiesFolder;

            const processManager = new ProcessManager();

            processManager.executeProcesses(client, "discordInteractionCreate", { data: { content: interaction, client, globalUtilitiesFolder } });
        });
    },
};
