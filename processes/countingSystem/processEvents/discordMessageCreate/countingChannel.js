const countingGuild = require("./databaseSchemaCountingGuild");

module.exports = {
    async execute(message, globalUtilitiesFolder) {
        if (message.author.bot) return;

        const { DatabaseManager } = globalUtilitiesFolder;

        const databaseManager = new DatabaseManager();

        // Find the guild in the database
        const guild = await databaseManager.find(countingGuild, {
            guildId: message.guild.id,
        }, true) || null;

        // If the channel entry is not defined in the database collection.
        if (guild.channelId === null) return;

        // If the channels id does not match the counting channels id
        if (message.channel.id !== guild.channelId) return;

        // If message is not a number
        if (isNaN(message.content)) {
            if (guild.allowNonNumbers === true) return;
            message.delete();

            return;
        }

        if (parseInt(message.content) !== guild.nextNumber || guild.lastCounterId === message.author.id) {
            guild.nextNumber = 1;
            guild.lastCounterId = "0";

            await guild.save();

            message.channel.send(`${message.author} ruined the count! The next number is 1.`);
        } else {
            guild.nextNumber += 1;
            guild.lastCounterId = message.author.id;

            await guild.save();

            message.react("🤍");
        }
    },
};
