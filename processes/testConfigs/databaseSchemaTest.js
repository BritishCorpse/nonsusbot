const mongoose = require("mongoose");

// TODO: move these validators into global utilities

const discordMessageContent = {
    type: String,
    // TODO: put the "magic numbers" somewhere as constants (discord minimum and maximum message length)
    minLength: [1, "Discord message content is too short."],
    maxLength: [2000, "Discord message content is too long."],
};

const snowflake = {
    type: String,
    validate: {
        validator: v => (/\d+/u).test(v),
        message: props => `${props.value} is not a valid Snowflake`,
    },
};

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, unique: true, immutable: true,
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
            ...snowflake,
            // just in case two different guilds use the same verification
            // channel (not really possible)
            require: true,
            unique: true,
        },
    },
});

const model = mongoose.model("Test_VerificationConfig", databaseSchema);

module.exports = model;
