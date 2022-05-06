const { warningLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "linkfilter",
    async execute(client) {
        client.on("messageCreate", async (message) => {
            //Check if the server has the profanity filter enabled.
            const linkFilter = await client.serverConfig.get(message.guild.id).allow_links;
            
            if (!message.guild) return;
            if (!message.author) return;
            if (message.author.bot) return;

            if (linkFilter === true) return;

            if (message.content.includes("https:") || message.content.includes("http:")) {
                try {
                    message.delete();
                } catch (error) {
                    warningLog("UNABLE TO DELETE MESSAGE", `${__dirname}/${__filename}.js`, "most likely a guild setup PEBCAK", "GUILD-WARNING");
                }

            }
        });
    }
};