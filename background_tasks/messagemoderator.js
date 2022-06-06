const { badWords } = require(`${__basedir}/utilities`);

async function containsLink(message) {
    if (message.content.includes("https://") || message.content.includes("http://") || message.content.includes("www.")) {  
        return true;
    }

    return false;
}

async function containsSwearing(message) {
    if (badWords.includes(message.content)) {
        return true;
    }

    return false;
} 

async function messageTooLong(message, maxWordCount) {
    const messageWordCount = message.content.split(" ");

    if (messageWordCount > maxWordCount) {
        return true;
    }

    return false;
}

module.exports = {
    name: "messagemoderator",
    async execute(client) {
        client.on("messageCreate", async (message) => {
            if (!message.guild) return;
            if (!message.author) return;
            if (message.author.bot) return;

            //Check if the server has the profanity filter enabled.
            const allowLinks = await client.serverConfig.get(message.guild.id).allow_links || null;
            
            if (allowLinks === false) {
                if (await containsLink(message) === true) {
                    message.delete().catch(() => {
                        return;
                    });
                }
            }

            //Check if the server has the profanity filter enabled.
            let profanityFilter;

            if (client.serverConfig.get(message.guild.id).profanity_filter) {
                profanityFilter = await client.serverConfig.get(message.guild.id).profanity_filter;
            } else {
                profanityFilter === false;
            }

            if (profanityFilter === true) {
                if (await containsSwearing(message) === true) {
                    message.delete().catch(() => {
                        return;
                    });
                }
            }

            //Check if the server has set a max message length
            let maxWordLen;
            if (client.serverConfig.get(message.guild.id).max_word_count) {
                maxWordLen = await client.serverConfig.get(message.guild.id).max_word_count;
            } else maxWordLen = null;

            if (maxWordLen !== null) {
                if (await messageTooLong(message, maxWordLen) === true) {
                    message.delete().catch(() => {
    
                    });
                }
            }
        });
    }
};