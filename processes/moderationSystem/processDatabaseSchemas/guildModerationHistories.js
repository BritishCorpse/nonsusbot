const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, immutable: true,
    },

    totalWarnings: {
        type: Number, require: true, "default": 0,
    },

    totalBans: {
        type: Number, require: true, "default": 0,
    },
});

const model = mongoose.model("GuildModerationHistories", databaseSchema);

module.exports = model;
