module.exports = {
    name: "botlogs",
    execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            if (!interaction.isCommand()) return;

            console.log(
                `\n${interaction.user.tag} initiated the command ${interaction.commandName} at ${new Date().toUTCString()} with the options ${interaction.options.data || "(No options given)"}`,
            );
        });
    }
};