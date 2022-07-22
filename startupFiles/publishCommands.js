module.exports = {
    execute() {
        const fs = require("node:fs");

        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v9");
        const { botId, token} = require(`${__basedir }/sources/botConfigs.json`);
        
        const { devServerId, isInProduction } = require(`${__basedir}/sources/developmentConfigs.json`);
        
        // these are categories that should not be added into the main bots commands.
        const categoriesToSkip = ["development", "dummy"];
        
        // this is where we will store all the commands
        const commands = [];
        
        // get all the command category folders
        const categoryFolders = fs.readdirSync(`${__basedir}/processes/commandHandler/commandCategories`);
        
        //* loop through all the categories, and push each command in a respective category to the commands array.
        for (const category of categoryFolders) {
            //* skips dev commands being pushed to the main version of the bot
            if (isInProduction === true && categoriesToSkip.includes(category)) continue;
        
            const commandFiles = fs.readdirSync(`${__basedir}/processes/commandHandler/commandCategories/${category}`)
                .filter(commandFile => commandFile.endsWith(".js"));
        
            for (const commandFile of commandFiles) {
                const command = require(`${__basedir}/processes/commandHandler/commandCategories/${category}/${commandFile}`);
                command.category = category;
                
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
    }
};

