const fs = require("fs");


class ConfigManager {
    constructor(configFilePath) {
        this.configFilePath = configFilePath;
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
        // fix the config file in case it is missing
        // TODO: create the file if it is missing, including all directories
        //       to get to it
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
