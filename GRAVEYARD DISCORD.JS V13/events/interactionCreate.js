const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactioncreate",
    async execute(graveyard) {
        graveyard.on("interactionCreate", async interaction => {
            // if interaction is a command
            if (interaction.type === InteractionType.ApplicationCommand) {
                const commandHandlerFile = require(`${__basedir}/events/eventFiles/commandHandler.js`);

                await commandHandlerFile.execute(graveyard, interaction);
            }

            // if interaction is a messagecomponent
            if (interaction.type === InteractionType.MessageComponent) {
                const messageComponentHandlerFile = require(`${__basedir}/events/eventFiles/messageComponentHandler.js`);

                await messageComponentHandlerFile.execute(graveyard, interaction);
            }
        });
    }
};