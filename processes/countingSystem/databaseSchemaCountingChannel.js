const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema({
    guildId: { type: String, require: true },
    channelId: { type: String, require: true, unique: true },
    allowNonNumbers: { type: Boolean, require: true, unique: false},
});

const model = mongoose.model("CountingChannel", databaseSchema);
 
module.exports = model;