const guildAutoModerationConfigs = require("../../processDatabaseSchemas/guildAutoModerationConfigs");

class SpamFilter {
    constructor() {
        this.users = {};
    }

    addUser(userId, guildId) {
        const userObject = {
            timeLimit: Date.now() + this.duration,
            messageCount: 1,
        };

        this.users[userId + guildId] = userObject;
    }

    setMessageInterval(messageAmount, duration) {
        this.messageAmount = messageAmount;
        this.duration = duration;
    }
}

const spamFilter = new SpamFilter();

// eslint-disable-next-line no-magic-numbers

module.exports = {
    async execute({ data }) {
        const message = data.content;

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        const user = message.author;

        const guildConfigs = await databaseManager.find(guildAutoModerationConfigs, {
            guildId: message.guild.id,
        }, true);

        if (guildConfigs.options.spamFilter.enabled === false) {
            return;
        }

        spamFilter.setMessageInterval(parseInt(guildConfigs.options.spamFilter.messageAmount), parseInt(guildConfigs.options.spamFilter.duration * guildConfigs.options.spamFilter.durationType));

        let userInSpamFilter = spamFilter.users[user.id + message.guild.id];

        // if the user doesnt exist, create them
        if (!userInSpamFilter) {
            spamFilter.addUser(user.id, message.guild.id);

            userInSpamFilter = spamFilter.users[user.id + message.guild.id];
        }

        // check if the message interval has expired
        if (Date.now() > userInSpamFilter.timeLimit) {
            userInSpamFilter.timeLimit = Date.now() + spamFilter.duration;

            userInSpamFilter.messageCount = 0;
        }

        // check if theyre past their allowed message limit
        if (userInSpamFilter.messageCount > spamFilter.messageAmount) {
            message.delete();
        }

        userInSpamFilter.messageCount++;

        console.log(userInSpamFilter);
    },
};
