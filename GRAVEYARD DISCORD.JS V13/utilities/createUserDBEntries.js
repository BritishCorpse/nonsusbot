const { userCount } = require("../db_objects");
const { sendError } = require("./sendError");

module.exports = {
    async execute(graveyard, user) {
        //* log that were creating database entries
        // this helps us know if and when something goes wrong
        console.log(`Creating user database entries at ${new Date()}..`);

        //* make an empty array which consists of all the failed entry creations
        const failedEntries = [];

        //* userCount
        await userCount.create({ userId: user.id }).catch(async error => {failedEntries.push("Usercount Entry"); await sendError(error);});

        //* send a log informing us that database entries finished creating
        console.log(`User database entries have finished creating at ${new Date()}.`);
        console.log(`Entries that failed to be created: ${failedEntries || "No entries."}`);
    }
};