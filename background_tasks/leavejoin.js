module.exports = {
    name: "leavejoin",
    async execute(client) {
        client.on("guildMemberAdd", async (guildMember) => {
            /* It's getting the channel ID from the serverConfig.json file. */
            let channel;
            if (client.serverConfig.get(guildMember.guild.id).welcome_channel_id) {
                channel = await client.channels.fetch(client.serverConfig.get(guildMember.guild.id).welcome_channel_id);
            }
            if (channel === undefined) return;

            /* It's getting the channel ID from the serverConfig.json file. */
            let welcome_message = client.serverConfig.get(guildMember.guild.id).welcome_message;

            /* It's checking if the welcome_message is empty. If it is, it will return. */
            if (!welcome_message) return;

            /* It's checking if the welcome_message includes {user}. If it does, it will replace it
            with the user's name. */
            if (welcome_message.includes("{user}")) {
                welcome_message = welcome_message.replace("{user}", `${guildMember}`);
            }

            /* It's checking if the welcome_message includes {server}. If it does, it will replace it
            with the server's name. */
            if (welcome_message.includes("{server}")) {
                welcome_message = welcome_message.replace("{server}", `${guildMember.guild.name}`);
            }

            /* It's creating an embed. */
            const embed = {
                color: "GREEN",
    
                description: `${welcome_message}`,
    
                author: {
                    name: "Server Assistant",
                    icon_url: client.user.displayAvatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },
    
                timestamp: new Date(),
    
                footer: {
                    text: "Powered by Graveyard",
                },
            };

            /* It's sending the embed to the channel. */
            channel.send({ embeds: [embed] });
        });

        client.on("guildMemberRemove", async (guildMember) => {
            /* It's getting the channel ID from the serverConfig.json file. */
            let channel;
            if (client.serverConfig.get(guildMember.guild.id).welcome_channel_id) {
                channel = await client.channels.fetch(client.serverConfig.get(guildMember.guild.id).welcome_channel_id);
            }
            if (channel === undefined) return;

            /* It's getting the channel ID from the serverConfig.json file. */
            let leave_message = client.serverConfig.get(guildMember.guild.id).leave_message;

            /* It's checking if the welcome_message is empty. If it is, it will return. */
            if (!leave_message) return;

            /* It's checking if the welcome_message includes {user}. If it does, it will replace it
            with the user's name. */
            if (leave_message.includes("{user}")) {
                leave_message = leave_message.replace("{user}", `${guildMember}`);
            }

            /* It's checking if the welcome_message includes {server}. If it does, it will replace it
            with the server's name. */
            if (leave_message.includes("{server}")) {
                leave_message = leave_message.replace("{server}", `${guildMember.guild.name}`);
            }

            /* It's creating an embed. */
            const embed = {
                color: "RED",
    
                description: `${leave_message}`,
    
                author: {
                    name: "Server Assistant",
                    icon_url: client.user.displayAvatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },
    
                timestamp: new Date(),
    
                footer: {
                    text: "Powered by Graveyard",
                },
            };

            /* It's sending the embed to the channel. */
            channel.send({ embeds: [embed] });
        });
    }
};