const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: {
        type: String, require: true, immutable: true,
    },

    userId: {
        type: String, require: true, immutable: true,
    },

    reason: {
        type: String, require: true,
    },

    warningId: {
        type: Number, require: true,
    },
});

const model = mongoose.model("GuildMemberWarnings", databaseSchema);

module.exports = model;
