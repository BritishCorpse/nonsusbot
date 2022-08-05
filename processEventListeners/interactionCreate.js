module.exports = {
    name: "interactionCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("interactionCreate", message => {
            const { ProcessManager } = globalUtilitiesFolder;

            const processManager = new ProcessManager();

            processManager.executeProcesses(client, "discordInteractionCreate", { data: { content: message, client, globalUtilitiesFolder } });
        });
    },
};
