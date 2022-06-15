const fs = require("fs");
const defaultServerConfig = require(`${__basedir}/configs/default_server_config.json`);

function collectionToJSON(collection) {
    // turns a discord collection to a JSON {key: value} dictionary
    const result = {};
    for (const [key, value] of collection) {
        result[key] = value;
    }
    return result;
}

async function saveServerConfig(serverConfig) {
    // Saves the client.serverConfig (given in argument as serverConfig) to server_config.json
    fs.writeFile(`${__basedir}/server_config.json`, JSON.stringify(collectionToJSON(serverConfig)),
        error => {
            if (error !== null) console.error(error);
        });
}

async function addNewGuildServerConfigs(graveyard) {
    // add new guilds to the server_config.json file
    const guilds = await graveyard.guilds.fetch();

    guilds.each(guild => {
        if (graveyard.serverConfig.get(guild.id) === undefined) {
            // JSON.parse JSON.stringify makes a deep copy, which is needed to fix a bug where editing one config edits multiple configs because they are the same object
            graveyard.serverConfig.set(guild.id, JSON.parse(JSON.stringify(defaultServerConfig))); 
        }
    });
    // save it to the server_config.json file
    await saveServerConfig(graveyard.serverConfig);
}

module.exports = {
    saveServerConfig,
    addNewGuildServerConfigs
};