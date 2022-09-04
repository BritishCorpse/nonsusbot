/* eslint-disable no-magic-numbers */
/* eslint-disable object-shorthand */
const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");
const guildMemberModerationHistories = require("../../processDatabaseSchemas/guildMemberModerationHistories");
const guildMemberWarnings = require("../../processDatabaseSchemas/guildMemberWarnings");
const guildModerationHistories = require("../../processDatabaseSchemas/guildModerationHistories");

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

        if (spamFilter.isEnabled === false) return;
        if (spamFilter.moderateBots === false && message.author.bot) return;

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

        harvestedUser.messageCount++;

        // check if the message interval has expired
        if (Date.now() > harvestedUser.timeLimit) {
            harvestedUser.timeLimit = Date.now() + (spamFilter.duration * spamFilter.durationType);

            harvestedUser.messageCount = 1;

            harvest.set(harvestId, harvestedUser);
        }

        // check if theyre past their allowed message limit
        if (harvestedUser.messageCount > spamFilter.messageAmount) {
            message.delete();

            // in the future: add to the guilds logging system

            const userInDatabase = await databaseManager.find(guildMemberModerationHistories, {
                guildId: message.guild.id,
                userId: message.author.id,
            }, true);

            userInDatabase.spamFilterInfractionCount++;
            await userInDatabase.save();

            // offsets the punishment number by 1 so that we can index the punishment array of the spam filter accurately
            let punishmentNumber = userInDatabase.spamFilterInfractionCount - 1;

            // if theres no punishments to issue, we just delete the message
            // eslint-disable-next-line consistent-return
            if (spamFilter.punishments.length < 1) return console.log("too little punishments");

            // if the punishment number is too far, we set it to be the last punishment in the list.
            if (spamFilter.punishments.length < punishmentNumber) {
                punishmentNumber = spamFilter.punishments.length - 1;
            }

            // this object contains every possible punishment
            // the reason this is an object is so that we can dynamically call a specific punishment
            const punishments = {
                warn: async function () {
                    // this increases the warning id by 1
                    const guildHistories = await databaseManager.find(guildModerationHistories, {
                        guildId: message.guild.id,
                    }, true);

                    guildHistories.totalWarnings++;
                    await guildHistories.save();

                    await databaseManager.create(guildMemberWarnings, {
                        guildId: message.guild.id,
                        userId: message.author.id,
                        reason: "Spamming. ~Automoderator",
                        warningId: guildHistories.totalWarnings,
                    }, true);

                    message.channel.send(`${message.author}! You've been warned for: \`Spamming\`.`).then(m => {
                        setTimeout(() => {
                            m.delete();
                        }, 2000);
                    });
                },

                kick: async function () {
                    await message.member.kick(["Kicked by automoderator."]).catch(error => {
                        console.error(error);
                    });
                },

                ban: async function () {
                    await message.member.ban(["Kicked by automoderator."]).catch(error => {
                        console.error(error);
                    });
                },
            };

            const punishment = spamFilter.punishments[punishmentNumber];

            console.log(punishment);

            await punishments[punishment]();
        }
    },
};
