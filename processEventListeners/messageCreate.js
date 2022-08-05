module.exports = {
    name: "messageCreate",
    execute(client, globalUtilitiesFolder) {
        client.on("messageCreate", message => {
            const { ProcessManager } = globalUtilitiesFolder;

            const processManager = new ProcessManager();

            processManager.executeProcesses(client, "discordMessageCreate", { data: { content: message, client } });
        });
    },
};
