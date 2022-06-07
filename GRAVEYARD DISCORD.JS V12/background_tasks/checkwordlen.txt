const developmentConfig = require(`${__basedir}/development_config.json`);

module.exports = {
    name: "checkwordlen",
    async execute(client) {
        client.on("messageCreate", async (message) => {
            if (message.author.id === client.id) return;
            if (message.guild === null) return;
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            let maxWordLen;
            if (client.serverConfig.get(message.guild.id).max_word_count) {
                maxWordLen = await client.serverConfig.get(message.guild.id).max_word_count;
            }
            
            if (maxWordLen === null) return;

            const messageWordCount = message.content.split(" ");


            if (messageWordCount.length > parseInt(maxWordLen)) {
                try {
                    message.delete();
                } catch (error) {
                    return;
                }
            }
        });
    }
};