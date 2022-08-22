const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");

const Harvest = require("../../../../globalUtilities/Harvest");

const harvest = new Harvest();

module.exports = {
    async execute({ data }) {
        // define stuff passed through from the data object
        const message = data.content;
        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        // find the guild in database
        const guildInDatabase = await databaseManager.find(guildAutoModerationConfigs, {
            guildId: message.guild.id,
        }, true);

        const spamFilter = guildInDatabase.options.spamFilter;

        // if they have their spam filter disabled
        if (spamFilter.isEnabled === false) {
            return;
        }

        // id used to look up data from the harvest class
        const harvestId = { userId: message.author.id, guildId: message.guild.id };

        let harvestedUser = harvest.get(harvestId);

        // if the user doesnt exist in the harvest, create them
        if (!harvestedUser) {
            const userObject = {
                timeLimit: Date.now() + (spamFilter.duration * spamFilter.durationType),
                messageCount: 0,
            };

            harvestedUser = harvest.set(harvestId, userObject);
        }

        // add one to the users messageCount
        harvestedUser.messageCount++;

        // check if the message interval has expired
        if (Date.now() > harvestedUser.timeLimit) {
            harvestedUser.timeLimit = Date.now() + spamFilter.duration;

            harvestedUser.messageCount = 1;

            harvest.set(harvestId, harvestedUser);
        }

        // check if theyre past their allowed message limit
        if (harvestedUser.messageCount > spamFilter.messageAmount) {
            message.delete();
        }
    },
};
