module.exports = {
    execute() {
        const fs = require("node:fs");

        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v9");
        const { botId, token } = require(`${__basedir}/sources/botConfigs.json`);

        const { devServerId, isInProduction } = require(`${__basedir}/sources/developmentConfigs.json`);

        // this is where we will store all the commands
        const commands = [];

        const processes = fs.readdirSync(`${__basedir}/processes`);

        for (const process of processes) {
            if (fs.existsSync(`${__basedir}/processes/${process}/processEvents/discordCommandCreate`) === false) continue;

            const commandFiles = fs.readdirSync(`${__basedir}/processes/${process}/processEvents/discordCommandCreate`)
                .filter(file => file.endsWith(".js"));

            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/${process}/processEvents/discordCommandCreate/${commandFile}`);

                command.process = process;

                commands.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: "9" }).setToken(token);

        if (isInProduction === false) {
            rest.put(Routes.applicationGuildCommands(botId, devServerId), { body: commands })
                .then(() => log("Registered application commands in the development server."));
        } else {
            rest.put(Routes.applicationCommands(botId), { body: commands })
                .then(() => log("Registered application commands globally."));
        }
    },
};
