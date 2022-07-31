const mongoose = require("mongoose");
const { discordMessageContent, discordSnowflake } = require(`${__basedir}/globalUtilities`);

const databaseSchema = new mongoose.Schema({
    guildId: {
        ...discordSnowflake,
        require: true,
        unique: true,
        immutable: true,
    },

    // the "configs" object in ANY collection will be treated as a config in the
    // dashboard
    configs: {
        messageContent: {
            ...discordMessageContent,
            require: true,
            "default": "Please verify!",
        },
        channelId: {
            ...discordSnowflake,
            // just in case two different guilds use the same verification
            // channel (not really possible)
            require: true,
            unique: true,
        },
    },
});

const model = mongoose.model("Test_VerificationConfig", databaseSchema);

module.exports = model;
