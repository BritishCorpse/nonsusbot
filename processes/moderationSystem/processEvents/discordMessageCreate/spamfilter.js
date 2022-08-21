const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");

const Harvest = require("../../../../globalUtilities/Harvest");

const harvest = new Harvest();

module.exports = {
    async execute({ data }) {
        const message = data.content;

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        const guildInDatabase = await databaseManager.find(guildAutoModerationConfigs, {
            guildId: message.guild.id,
        }, true);

        const spamFilter = guildInDatabase.options.spamFilter;

        if (spamFilter.isEnabled === false) {
            return;
        }

        const harvestId = { userId: message.author.id, guildId: message.guild.id };

        let harvestedUser = harvest.get(harvestId);

        // if the user doesnt exist, create them
        if (!harvestedUser) {
            const userObject = {
                timeLimit: Date.now() + this.duration,
                messageCount: 0,
            };

            harvestedUser = harvest.set(harvestId, userObject);
        }

        harvestedUser.messageCount++;

        // check if the message interval has expired
        if (Date.now() > harvestedUser.timeLimit) {
            harvestedUser.timeLimit = Date.now() + spamFilter.duration;

            harvestedUser.messageCount = 0;
        }

        // check if theyre past their allowed message limit
        if (harvestedUser.messageCount > spamFilter.messageAmount) {
            message.delete();
        }

        // update the harvest
        harvest.set(harvestId, harvestedUser);

        console.log(harvestedUser);
    },
};
