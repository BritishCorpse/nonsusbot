const fs = require("fs");

module.exports = {
    async execute(client) {
        const categoryFolders = fs.readdirSync(`${__basedir}/processes/commandHandler/commandCategories`);

        for (const category of categoryFolders) {
            const commandFiles = fs.readdirSync(`${__basedir}/processes/commandHandler/commandCategories/${category}`)
                .filter(commandFile => commandFile.endsWith(".js"));
        
            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/commandHandler/commandCategories/${category}/${commandFile}`);
                command.category = category;
                client.commands.set(command.data.name, command);
            }
        }

        log("Added commands to client collection.");
    }
};