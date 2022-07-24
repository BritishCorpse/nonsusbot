const fs = require("fs");

module.exports = {
    execute(client) {
        const processes = fs.readdirSync(`${__basedir}/processes`);

        for (const process of processes) {
            const commandFiles = fs.readdirSync(`${__basedir}/processes/${process}/commands`)
                .filter(file => file.endsWith("Command.js"));

            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/${process}/commands/${commandFile}`);

                command.process = process;

                client.commands.set(command.data.name, command);
            }
        }

        log("Added commands to client collection.");
    },
};
