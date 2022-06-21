const fs = require("fs");
const path = require("path");


class ConfigManager {
    constructor(configFilePath) {
        // make the path absolute to fix require problems with relative paths
        this.configFilePath = path.resolve(configFilePath);
    }

    // Public methods

    getGuildConfigs(guildId) {
        // read directly from the file every time, since the file could be
        // edited by the dashboard or directly by the developers
        const configs = this._readConfigs();
 
        return configs[guildId];
    }

    updateGuildConfigs(guildId, guildConfigsToUpdate) {
        // guildConfigsToUpdate does not need to include every property, it
        // will get merged with all other properties automatically

        const configs = this._readConfigs();

        // merge the old values with the new values, prioritizing the new ones
        configs[guildId] = {
            ...configs[guildId],
            ...guildConfigsToUpdate
        };

        this._saveConfigs(configs);
    }

    // Private methods

    _restoreConfigFile() {
        // fix the config file in case it is missing or empty

        if (!fs.existsSync(this.configFilePath)) {
            // make all the parent directories for the file
            fs.mkdirSync(path.dirname(this.configFilePath), {recursive: true});

            fs.writeFileSync(this.configFilePath, "{}");
        } else if (fs.readFileSync(this.configFilePath).length === 0) {
            // make it an empty object so that requiring the file still works
            // if the file is empty
            fs.writeFileSync(this.configFilePath, "{}");
        }
    }

    _saveConfigs(configs) {
        this._restoreConfigFile();

        fs.writeFileSync(this.configFilePath, JSON.stringify(configs));
    }

    _readConfigs() {
        this._restoreConfigFile();

        const configs = require(this.configFilePath);

        return configs;
    }
}

module.exports = { ConfigManager };
