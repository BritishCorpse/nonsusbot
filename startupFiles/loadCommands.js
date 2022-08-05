const fs = require("fs");

module.exports = {
    execute(client) {
        const processes = fs.readdirSync(`${__basedir}/processes`);

        for (const process of processes) {
            if (fs.existsSync(`${__basedir}/processes/${process}/processEvents/discordCommandCreate`) === false) continue;

            const commandFiles = fs.readdirSync(`${__basedir}/processes/${process}/processEvents/discordCommandCreate`)
                .filter(file => file.endsWith(".js"));

            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/${process}/processEvents/discordCommandCreate/${commandFile}`);

                command.process = process;

                client.commands.set(command.data.name, command);

                log(`Added ${command.data.name} command to client commands collection.`);
            }
        }

        log("Added commands to client collection.");
    },
};
