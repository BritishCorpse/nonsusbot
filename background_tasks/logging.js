

async function sendLog(client, guildId, color, title, info) {
    //Base embed to fill with userful information in the events.
    const embed = {
        color: color,

        title: title,

        author: {
            name: "Logger.",
            icon_url: client.user.displayAvatarURL(),
            url: "https://talloween.github.io/graveyardbot/",
        },

        fields: [
            info
        ],

        timestamp: new Date(),

        footer: {
            text: "Powered by Graveyard",
        },
    };

    //Check if the log channel exists.
    let logChannel;

    if (client.serverConfig.get(guildId).log_channel_id) {
        logChannel = await client.channels.fetch(client.serverConfig.get(guildId).log_channel_id);
    }  

    if (logChannel === undefined) return;

    logChannel.send({embeds: [embed]});
}

module.exports = {
    name: "logging",
    async execute(client){
        async function checkDL(guildId) {
            //Check if the server has detailed logging enabled.
            let detailedLogging;
        
            if (client.serverConfig.get(guildId).detailed_logging) {
                detailedLogging = await client.serverConfig.get(guildId).detailed_logging;
            }

            if (detailedLogging === undefined | "false") return false;

            if (detailedLogging === "true") return true;
        
        }

        try { 
            client.on("messageDelete", async (message) => {
                const info = [
                    {
                        name: "Author",
                        value: `${message.author}`
                    },
                    {
                        name: "Content",
                        value: `${message.cleanContent}`
                    },
                    {
                        name: "ID",
                        value: `${message.id}`
                    }
                ];

                sendLog(client, message.guild.id, "RED", "A message was deleted.", info);
            });

            client.on("messageUpdate", async (oldMessage, newMessage) => {
                let oldContent = oldMessage.cleanContent;
                let newContent = newMessage.cleanContent;

                if(!oldMessage.content) {
                    oldContent = oldMessage.attachments;
                }

                if(!newMessage.content) {
                    newContent = newMessage.attachments;
                }

                const info = [
                    {
                        name: "Author",
                        value: `${oldMessage.author}`
                    },
                    {
                        name: "Old content",
                        value: `${oldContent}`
                    },
                    {
                        name: "New content",
                        value: `${newContent}`
                    },
                    {
                        name: "ID",
                        value: `${newMessage.id}`
                    }
                ];

                sendLog(client, oldMessage.guild.id, "YELLOW", "A message was edited.", info);
            });

            client.on("guildBanAdd", async (ban) => {
                const info = [
                    { 
                        name: "Banned user",
                        value: `${ban.user}`
                    },
                    {
                        name: "Reason",
                        value: `${ban.reason || "There was reason no for the ban."}`
                    }
                ];

                sendLog(client, ban.guild.id, "#ff8800", "A user was banned.", info);
            });

            client.on("guildBanRemove", async (ban) => {
                const info = [
                    { 
                        name: "Unbanned user",
                        value: `${ban.user}`
                    },
                    {
                        name: "Reason",
                        value: `${ban.reason || "There was reason no for the ban."}`
                    }
                ];

                sendLog(client, ban.guild.id, "#0077ff", "A user was unbanned.", info);
            });

            client.on("guildScheduledEventCreate", async (GuildScheduledEvent) => {
                const guildEvent = GuildScheduledEvent;

                const info = [
                    {
                        name: "Name",
                        value: `${guildEvent.name}`
                    },
                    {
                        name: "Creator",
                        value: `${guildEvent.creator}`
                    },
                    {
                        name: "Channel",
                        value: `${guildEvent.channel || "This event is not associated with a channel."}`
                    },
                    {
                        name: "Description",
                        value: `${guildEvent.description || "The event does not have a description."}`
                    },
                    {
                        name: "Starts at",
                        value: `${guildEvent.scheduledStartAt}`
                    }
                ];

                sendLog(client, guildEvent.guild.id, "GREEN", "A scheduled guild event was created.", info);
            });
            
            client.on("guildScheduledEventDelete", async (GuildScheduledEvent) => {
                const guildEvent = GuildScheduledEvent;

                const info = [
                    {
                        name: "Name",
                        value: `${guildEvent.name}`
                    },
                    {
                        name: "Channel",
                        value: `${guildEvent.channel || "This event is not associated with a channel."}`
                    },
                    {
                        name: "Description",
                        value: `${guildEvent.description || "The event does not have a description."}`
                    }
                ];

                sendLog(client, guildEvent.guild.id, "RED", "A scheduled guild event was deleted.", info);
            });

            client.on("threadCreate", async (ThreadChannel) => {
                const info = [
                    {
                        name: "Creator",
                        value: `<@!${ThreadChannel.ownerId}>`
                    },
                    {
                        name: "Channel",
                        value: `${ThreadChannel.name}`
                    },
                    {
                        name: "ID",
                        value: `${ThreadChannel.id}`
                    }
                ];

                sendLog(client, ThreadChannel.guild.id, "GREEN", "A thread was created", info);
            });
            
            client.on("threadDelete", async (ThreadChannel) => {
                const info = [
                    {
                        name: "Creator",
                        value: `<@!${ThreadChannel.ownerId}>`
                    },
                    {
                        name: "Channel",
                        value: `${ThreadChannel.name}`
                    },
                    {
                        name: "ID",
                        value: `${ThreadChannel.id}`
                    }
                ];

                sendLog(client, ThreadChannel.guild.id, "red", "A thread was deleted", info);
            });

            client.on("channelCreate", (channel) => {
                const info = [
                    {
                        name: "Name",
                        value: `${channel.name}`,
                    },
                    {
                        name: "Type",
                        value: `${channel.type}`
                    },
                    {
                        name: "ID",
                        value: `${channel.id}`
                    }
                ];

                sendLog(client, channel.guild.id, "GREEN", "A channel was created.", info);
            });

            client.on("channelDelete", (channel) => {
                const info = [
                    {
                        name: "Name",
                        value: `${channel.name}`,
                    },
                    {
                        name: "Type",
                        value: `${channel.type}`
                    },
                    {
                        name: "ID",
                        value: `${channel.id}`
                    }
                ];

                sendLog(client, channel.guild.id, "RED", "A channel was deleted.", info);
            });

            client.on("roleCreate", async (role) => {
                const info = [
                    {
                        name: "Role name",
                        value: `${role.name}`
                    },
                    {
                        name: "Color",
                        value: `${role.hexColor}`
                    },
                    {
                        name: "Permissions",
                        value: `${role.permissions}`
                    },
                    {
                        name: "Mentionable",
                        value: `${role.mentionable}`
                    },
                    {
                        name: "ID",
                        value: `${role.id}`
                    }
                ];

                sendLog(client, role.guild.id, "GREEN", "A role was created.", info);
            });

            client.on("roleDelete", async (role) => {
                const info = [
                    {
                        name: "Role name",
                        value: `${role.name}`
                    },
                    {
                        name: "ID",
                        value: `${role.id}`
                    }
                ];

                sendLog(client, role.guild.id, "RED", "A role was deleted.", info);
            });

            // Requires detailed logging.
            client.on("channelPinsUpdate", async (channel) => {
                const DL = await checkDL(channel.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Channel name",
                            value: `${channel.name}`,
                        },
                    ];
    
                    sendLog(client, channel.guild.id, "YELLOW", "A channels pinned messages were updated.", info);
                }else return;
            });

            // Requires detailed logging.
            client.on("emojiCreate", async (emoji) => {
                const DL = await checkDL(emoji.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Emoji name",
                            value: `${emoji.name}`
                        },
                        {
                            name: "Emoji URL",
                            value: `${emoji.url || "The URL to the emoji file does not exist."}`
                        },
                        {
                            name: "Created by",
                            value: `${emoji.author}`
                        },
                        {
                            name: "Animated",
                            value: `${emoji.animated}`
                        }
                    ];

                    sendLog(client, emoji.guild.id, "GREEN", "An emoji was created.", info);
                }else return;
            });

            // Requires detailed logging.
            client.on("emojiDelete", async (emoji) => {
                const DL = await checkDL(emoji.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Emoji name",
                            value: `${emoji.name}`
                        },
                        {
                            name: "Emoji URL",
                            value: `${emoji.url || "The URL to the emoji file does not exist."}`
                        },
                        {
                            name: "Created by",
                            value: `${emoji.author}`
                        },
                    ];

                    sendLog(client, emoji.guild.id, "RED", "An emoji was deleted.", info);
                }else return;
            });

            //Require detailed logging.
            client.on("guildMemberAdd", async (GuildMember) => {
                const DL = await checkDL(GuildMember.guild.id);
                if (DL === true) {
                    //Don't do this if it's an official discord system message.
                    if (GuildMember.system) return;

                    const info = [
                        {
                            name: "Username",
                            value: `${GuildMember.displayName}`
                        },
                        {
                            name: "Account created",
                            value: `${GuildMember.user.createdTimestamp}`
                        },
                        {
                            name: "ID",
                            value: `${GuildMember.user.id}`
                        },
                        {
                            name: "Bot",
                            value: `${GuildMember.user.bot}`
                        }                    
                    ];

                    sendLog(client, GuildMember.guild.id, "GREEN", "A user joined the server.", info);
                }
            });
    
            //Require detailed logging.
            client.on("guildMemberRemove", async (GuildMember) => {
                const DL = await checkDL(GuildMember.guild.id);
                if (DL === true) {
                    //Don't do this if it's an official discord system message.
                    if (GuildMember.system) return;

                    const info = [
                        {
                            name: "Username",
                            value: `${GuildMember.displayName}`
                        },
                        {
                            name: "ID",
                            value: `${GuildMember.user.id}`
                        },
                  
                    ];

                    sendLog(client, GuildMember.guild.id, "RED", "A user left server.", info);
                }
            });

            //Requires detailed logging.
            client.on("inviteCreate", async (invite) => {
                const DL = await checkDL(invite.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Creator",
                            value: `${invite.inviter.tag}`
                        },
                        { 
                            name: "Max uses",
                            value: `${invite.maxUses}`
                        },
                        {
                            name: "Expires at",
                            value: `${invite.expiresAt}`
                        },
                        { 
                            name: "Code",
                            value: `${invite.code}`
                        }
                    ];

                    sendLog(client, invite.guild.id, "GREEN", "An invite was created.", info);
                }
            });

            //Requires detailed logging.
            client.on("inviteDelete", async (invite) => {
                const DL = await checkDL(invite.guild.id);
                if (DL === true) {
                    const info = [
                        { 
                            name: "Code",
                            value: `${invite.code}`
                        }
                    ];

                    sendLog(client, invite.guild.id, "RED", "An invite was deleted.", info);
                }
            });
            
        //Don't think this really matters, it's just here for shits and giggles.
        }catch (error) {
            console.log("An error occured.");
        }

    }    
};