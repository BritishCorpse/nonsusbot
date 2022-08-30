const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, unique: true, immutable: true,
    },

    options: {
        spamFilter: {
            isEnabled: {
                type: Boolean,
                required: true,
                "default": false,
            },

            messageAmount: {
                type: Number,
                required: true,
                "default": 1000,
            },

            duration: {
                type: Number,
                required: true,
                "default": 1,
            },

            durationType: {
                type: Number,
                required: true,
                "default": 1000,
            },

            moderateBots: {
                type: Boolean,
                required: true,
                "default": false,
            },

            punishments: {
                type: Array,
                required: true,
                "default": null,
            },
        },
    },
});

const model = mongoose.model("GuildAutoModerationConfigs", databaseSchema);

module.exports = model;
