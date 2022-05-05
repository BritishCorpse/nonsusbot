const { warningLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "m",
    execute (client) {
        function deleteIfNotM(message) {
            // disable DMs
            if (message.guild === null) return;
            
            /* It's getting the channel ID from the serverConfig.json file. */
            const m_channel_id = client.serverConfig.get(message.guild.id).m_channel_id;
        
            if (!m_channel_id) return;

            if (message.channel.id === m_channel_id && message.content !== "m") {
                //try catch error handling
                try {
                    message.delete();
                } catch (error) {
                    warningLog("Unable to send a log", `${__dirname}/${__filename}.js`, "Most likely a PEBCAK permission error.", "GUILD-ERROR");
                    return;
                }

            }
        }

        client.on("messageCreate", message => {
            deleteIfNotM(message);
        });

        client.on("messageUpdate", (message) => {
            deleteIfNotM(message);
        });
    }
};
