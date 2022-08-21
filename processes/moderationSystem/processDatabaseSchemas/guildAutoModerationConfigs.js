const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, unique: true, immutable: true,
    },

    options: {
        spamFilter: {
            enabled: {
                type: Boolean,
                required: true,
                "default": false,
            },

            messageAmount: {
                type: Number,
                required: true,
                "default": 100,
            },

            duration: {
                type: Number,
                required: true,
                "default": 100,
            },

            durationType: {
                type: Number,
                required: true,
                "default": 3600000,
            },
        },
    },
});

const model = mongoose.model("GuildAutoModerationConfigs", databaseSchema);

module.exports = model;
