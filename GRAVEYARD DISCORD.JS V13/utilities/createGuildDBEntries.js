const { guildCount } = require("../db_objects");
const { sendError } = require("./sendError");

module.exports = {
    async execute(graveyard, guild) {
        //* log that were creating database entries
        // this helps us know if and when something goes wrong
        console.log(`Creating guild database entries at ${new Date()}..`);

        //* make an empty array which consists of all the failed entry creations
        const failedEntries = [];

        //* guildCount
        await guildCount.create({ guildId: guild.id }).catch(async error => {failedEntries.push("Guildcount Entry"); await sendError(error);});

        //* send a log informing us that database entries finished creating
        console.log(`Guild database entries have finished creating at ${new Date()}.`);
        console.log(`Entries that failed to be created: ${failedEntries || "No entries."}`);
    }
};