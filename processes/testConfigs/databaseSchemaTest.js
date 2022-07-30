const mongoose = require("mongoose");

// TODO: make and use schemas for configs

const databaseSchema = new mongoose.Schema({
    guildId: { type: String, require: true, immutable: true },
    channelId: { type: String, require: true, unique: true },
    configs: {
        message: {
            // the message the bot sends to tell people to verify
        },
        channel: {
            id: {/* ... */},
        },
    },
});

const model = mongoose.model("Test_VerificationChannelConfig", databaseSchema);

module.exports = model;
