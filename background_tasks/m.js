module.exports = {
    name: "m",
    execute (client) {
        function deleteIfNotM(message) {
            // disable DMs
            if (message.guild === null) return;
            
            const m_channel_id = client.serverConfig.get(message.guild.id).m_channel_id;
        
            if(!m_channel_id) {return;}

            if (message.channel.id === m_channel_id && message.content !== "m") {
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
