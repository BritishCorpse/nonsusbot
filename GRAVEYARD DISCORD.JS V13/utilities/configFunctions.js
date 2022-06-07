const fs = require("fs");

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

module.exports = {
    saveServerConfig
};