module.exports = {
    execute() {
        const fs = require("node:fs");

        const {REST} = require("@discordjs/rest");
        const {Routes} = require("discord-api-types/v9");
        const {botId, token} = require(`${__basedir }/sources/botConfigs.json`);
        
        const {devServerId, isInProduction} = require(`${__basedir}/sources/developmentConfigs.json`);
              
        // this is where we will store all the commands
        const commands = [];
        
        const processes = fs.readdirSync(`${__basedir}/processes`);
        
        for (const process of processes) {
            const commandFiles = fs.readdirSync(`${__basedir}/processes/${process}/commands`)
                .filter(file => file.endsWith("Command.js"));

            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/${process}/commands/${commandFile}`);

                command.process = process;

                commands.push(command.data.toJSON());
            }
        }

        const rest = new REST({version: "9"}).setToken(token);

        if (isInProduction === false) {
            rest.put(Routes.applicationGuildCommands(botId, devServerId), {body: commands})
                .then(() => log("Registered application commands in the development server."));
        } else {
            rest.put(Routes.applicationCommands(botId), {body: commands})
                .then(() => log("Registered application commands globally."));
        }
    },
};
