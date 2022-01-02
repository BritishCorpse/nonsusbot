module.exports = {
    name: "m",
    execute (client) {
        function deleteIfNotM(message) {
            // disable DMs
            if (message.guild === null) return;

            if (message.channel.id === client.serverConfig.get(message.guild.id).m_channel_id && message.content !== "m") {
                message.delete();
            }
        }

        client.on("messageCreate", message => {
            deleteIfNotM(message);
        });

        client.on("messageUpdate", (oldMessage, message) => {
            deleteIfNotM(message);
        });
    }
};
