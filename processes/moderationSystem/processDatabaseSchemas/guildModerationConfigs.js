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
                type: String,
                validate: {
                    function(durationType) {
                        const allowedTypes = ["Second", "Minute", "Hour"];

                        if (!allowedTypes.includes(durationType)) {
                            return false;
                        }

                        return true;
                    },

                    message: props => `${props.value} is invalid!`,
                },

                required: true,
                "default": "Hour",
            },
        },

        timeoutRoles: {
            type: Array,
            required: false,
            "default": [],
        },
    },
});

const model = mongoose.model("GuildModerationConfigs", databaseSchema);

module.exports = model;
