const countingChannel = require("./databaseSchemaCountingChannel");

const countingGuild = require("./databaseSchemaCountingGuild");

module.exports = {
    async execute(message, globalUtilitiesFolder) {
        if (message.author.bot) return;

        const { DatabaseManager } = globalUtilitiesFolder;

        const databaseManager = new DatabaseManager;

        // Try to find the counting channel in the database
        const channel = await databaseManager.find(countingChannel, {
            guildId: message.guild.id,
            channelId: message.channel.id
        }, false) || null;

        // If the channel entry is not defined in the database collection.
        if (channel === null) return;

        // If the channels id does not match the counting channels id
        if (message.channel.id !== channel.channelId) return;

        // If message is not a number
        if (isNaN(message.content)) {
            if (channel.allowNonNumbers === true) return;
            else return message.delete();
        }

        // Find the guild in the database
        const guild = await databaseManager.find(countingGuild, {
            guildId: message.guild.id
        }, true) || null;

        // If the number that the user sent isnt the correct one,
        // of if the last counter was the one whos counting now,
        // failed the count.
        // If everything is correct, add one to the count and change the last conter to be the message author
        if (parseInt(message.content) !== guild.nextNumber || guild.lastCounterId === message.author.id) {
            guild.nextNumber = 1;
            guild.lastCounterId = "0",

            await guild.save();

            message.channel.send(`${message.author} ruined the count! The next number is 1.`);
        } else {
            guild.nextNumber += 1;
            guild.lastCounterId = message.author.id;

            await guild.save();

            message.react("🤍");
        }
    }
};