const fs = require("fs");
const path = require("path");


class ConfigManager {
    constructor(configFilePath, defaultGuildConfigs) {
        // configFilePath is the JSON file where all the configs are stored
        // defaultGuildConfigs are the default values for the configs of a 
        // guild (optional)

        // make the path absolute to fix require problems with relative paths
        this.configFilePath = path.resolve(configFilePath);

        this.defaultGuildConfigs = defaultGuildConfigs;
    }

    // Public methods

    getGuildConfigs(guildId) {
        const configs = this._readConfigs();

        return {
            // start with the default values in case the guild isn't saved yet
            // or in case new configs have been added
            ...this.defaultGuildConfigs,
            
            // merge the configs
            ...configs[guildId]
        };
    }

    updateGuildConfigs(guildId, guildConfigsToUpdate) {
        // guildConfigsToUpdate does not need to include every property, it
        // will get merged with all other properties automatically

        const configs = this._readConfigs();

        configs[guildId] = {
            // start with the default values in case it is adding a new guild
            ...this.defaultGuildConfigs,

            // merge the old configs if they exist
            ...configs[guildId],

            // merge the new configs
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
