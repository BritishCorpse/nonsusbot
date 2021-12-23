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

    
    client.on("ready", () => {
      for (const guildId in client.serverConfig) {
        if (client.serverConfig.get(guildId.m_channel_id) === undefined
            || client.serverConfig.get(guildId.m_channel_id) === "") {
          continue;
        }
        client.channels.fetch(client.serverConfig.get(guildId).m_channel_id)
          .then(channel => {
            channel.messages.fetch({limit: 100})
              .then(messages => {
                for (const message of messages) {
                  deleteIfNotM(message[1]);
                }
              });
          });
      }
    });
	}		
};
