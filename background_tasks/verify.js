module.exports = {
    name: "verify",
    execute (client) {
        async function verifyUser(message) {
            // disable DMs
            if (message.guild === null) return;

            if (message.channel.id === client.serverConfig.get(message.guild.id).verify_channel_id && message.author.id !== message.client.user.id) {
                if (message.content.toLowerCase() == "yes") {
                    let verifiedRole;
                    if (client.serverConfig.get(message.guild.id).verify_role_id) {
                        verifiedRole = await message.guild.roles.fetch(client.serverConfig.get(message.guild.id).verify_role_id);
                    }
                    if (verifiedRole !== undefined) {
                        message.member.roles.add(verifiedRole);
                    }
                }
                message.delete();
            }
        }

        client.on("messageCreate", message => {
            verifyUser(message);
        });

        client.on("messageUpdate", (oldMessage, message) => {
            verifyUser(message);
        });

        
        client.on("ready", () => {
            // check last 100 messages from channel to verify
            for (const guildId in client.serverConfig) {
                if (client.serverConfig.get(guildId.verify_channel_id) === undefined
                    || client.serverConfig.get(guildId.verify_channel_id) === "") {
                    continue;
                }
                client.channels.fetch(client.serverConfig.get(guildId).verify_channel_id)
                    .then(channel => {
                        channel.messages.fetch({limit: 100})
                            .then(messages => {
                                for (const message of messages) {
                                    verifyUser(message[1]);
                                }
                            });
                    });
            }
        });
    }		
};
