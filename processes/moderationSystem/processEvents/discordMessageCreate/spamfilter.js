/* eslint-disable object-shorthand */
const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");
const guildMemberModerationHistories = require("../../processDatabaseSchemas/guildMemberModerationHistories");

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

        // if the user is a bot and the spam filter doesnt moderate non users
        if (spamFilter.moderateBots === false && message.author.bot) {
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
            // in the future: add to the guilds logging system

            // add one to the users infraction count
            const userInDatabase = await databaseManager.find(guildMemberModerationHistories, {
                guildId: message.guild.id,
                userId: message.author.id,
            }, true);

            userInDatabase.spamFilterInfractionCount++;
            await userInDatabase.save();

            console.log(`User infraction count ${userInDatabase.spamFilterInfractionCount}`);

            // issue the appropriate punishment

            // offsets the punishment number by 1 so that we can index the punishment array of the spam filter accurately
            // eslint-disable-next-line no-magic-numbers
            let punishmentNumber = userInDatabase.spamFilterInfractionCount - 1;

            // if theres no punishments to issue, we just delete the message
            // eslint-disable-next-line no-magic-numbers
            if (spamFilter.punishments.length < 1) {
                message.delete();
                return;
            }

            // this prevents us indexing out of range
            if (punishmentNumber > spamFilter.punishments.length) {
                punishmentNumber = spamFilter.punishments.length;
            }

            const punishments = {
                kick: function () {
                    // kick user
                },
                warn: function () {
                    // warn user
                },
                ban: function () {
                    // ban user
                },
            };

            console.log(`Punishments: ${spamFilter.punishments}`);
        }
    },
};
