const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, immutable: true,
    },

    userId: {
        type: String, require: true, immutable: true,
    },

    isBanned: {
        type: Boolean, require: true, "default": false,
    },

    timesMuted: {
        type: Number, require: true, "default": 0,
    },

    timesBanned: {
        type: Number, require: true, "default": 0,
    },

    spamFilterInfractionCount: {
        type: Number, require: true, "default": 0,
    },
});

const model = mongoose.model("GuildMemberModerationHistories", databaseSchema);

module.exports = model;
