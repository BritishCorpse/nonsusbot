async function sendLog(client, guildId, color, title, info, attachment) {
    //Check if the log channel exists.
    let logChannel;

    if (client.serverConfig.get(guildId).log_channel_id) {
        logChannel = await client.channels.fetch(client.serverConfig.get(guildId).log_channel_id);
    }  

    if (logChannel === undefined) return;

    //Base embed to fill with userful information in the events.
    if (!attachment){
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

        return logChannel.send({embeds: [embed]});
    } else {
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

            image: {
                url: `${attachment}`
            },
            timestamp: new Date(),

            footer: {
                text: "Powered by Graveyard",
            },
        };

        return logChannel.send({embeds: [embed]});
    }


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
                        name: "ID",
                        value: `${message.id}`
                    }
                ];

                //If there is an attachment and text
                if (message.attachments.size > 0 && message.content) {
                    info.push({
                        name: "Content", 
                        value: `${message.cleanContent} + (Attached Image[s])`
                    });
                }   

                //If there is only an attachment. (It flags as no message content)
                if (!message.content) {
                    info.push({
                        name: "Content",
                        value: "(Image)"
                    });
                }

                //If there is no attachment
                if (message.attachments.size < 1 && message.content) {
                    info.push({
                        name: "Content",
                        value: `${message.content}`
                    });
                }

                sendLog(client, message.guild.id, "RED", "A message was deleted.", info);
            });

            client.on("messageUpdate", async (oldMessage, newMessage) => {
                //Don't do this if it came from a bot.
                if (oldMessage.author.bot) return;

                let oldContent = oldMessage.cleanContent;
                let newContent = newMessage.cleanContent;

                //Don't send a message update log if it only added an embed or removed an embed.
                if (oldMessage.cleanContent === newMessage.cleanContent) return;

                //This checks for like image stuff.
                if (!oldMessage.content) {
                    oldContent = oldMessage.attachments;
                }

                if (!newMessage.content) {
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
                        value: `${role.permissions.FLAGS}`
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
    
                    sendLog(client, channel.guild.id, "YELLOW", "A channel's pinned messages were updated.", info);
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

            //Requires detailed logging.
            client.on("emojiUpdate", async (newEmoji) => {
                const DL = await checkDL(newEmoji.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "New name",
                            value: `${newEmoji.name}`
                        }
                    ];

                    sendLog(client, newEmoji.guild.id, "YELLOW", "An emoji was updated.", info);
                }
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
        
            //Requires detailed logging.
            client.on("roleUpdate", async (oldRole, newRole) => {
                const DL = await checkDL(oldRole.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Role name",
                            value: `${oldRole.name}`
                        }
                    ];

                    //If nothing changed, return.
                    if (oldRole === newRole) return;

                    //Compares the names of the roles.
                    if (oldRole.name !== newRole.name) {
                        info.push({
                            name: "New name",
                            value: `${newRole.name}`
                        });
                    }

                    //Compares the permissions of the roles.
                    if (oldRole.permissions.length !== newRole.permissions.length) {                
                        let perms = newRole.permissions.toArray();

                        for (let i = 0; i < perms.length; i++) {
                            perms = perms.toString().replace(",", "\n");
                        } 

                        info.push({
                            name: "New permissions",
                            value: `\`${perms.toLowerCase()}\``
                        });
                    }

                    //Compares the colours of the roles.
                    if (oldRole.color !== newRole.color) {
                        info.push({
                            name: "New color",
                            value: `${newRole.hexColor}`
                        });
                    }

                    //Compares the position of the role.
                    //This doesn't work for some reason. Couldn't be bothered to fix it really. :shrug:
                    if (oldRole.position !== newRole.position) {
                        info.push({
                            name: "New position",
                            value: `${newRole.position}`
                        });
                    }

                    info.push(
                        {
                            name: "ID",
                            value: `${newRole.id}`
                        });

                    sendLog(client, newRole.guild.id, "YELLOW", "A role was updated.", info);
                }
            });

            //Requires detailed logging.
            client.on("guildMemberUpdate", async (oldMember, newMember) => {
                const DL = await checkDL(oldMember.guild.id);
                if (DL === true) {
                    const info = [
                        {
                            name: "Tag",
                            value: `${newMember.user.tag}`
                        }
                    ];

                    //Check for the users displayname
                    if (oldMember.displayName !== newMember.displayName) {
                        info.push({
                            name: "New name",
                            value: `${newMember.displayName}`
                        });
                    }

                    //Check for pfp
                    if (oldMember.avatar !== newMember.avatar) {
                        info.push({
                            name: "Avatar",
                            value: "See attached image."
                        });

                        return sendLog(client, newMember.guild.id, "YELLOW", "A user updated their avatar.", info, newMember.displayAvatarURL());
                    }

                    //Check for the users color
                    if (oldMember.displayHexColor !== newMember.displayHexColor) {
                        info.push({
                            name: "New color",
                            value: `${newMember.displayHexColor}`
                        });
                    }

                    //Check for the users roles 
                    const oldRoles = oldMember.roles.cache.filter((roles) => roles.id !== newMember.guild.id).map((role) => ` ${role.toString().replace(",", "")}`);
                    const newRoles = newMember.roles.cache.filter((roles) => roles.id !== newMember.guild.id).map((role) => ` ${role.toString().replace(",", "")}`);

                    if (oldRoles.length > newRoles.length || oldRoles.length < newRoles.length) {
                        if (newRoles.length > 1) {
                            info.push({
                                name: "Updated Roles",
                                value: `${newRoles || "No roles"}`
                            });
                        } else {
                            info.push({
                                name: "Updated Roles",
                                value: "**WARNING!** No roles found. This could be due to the user not having any roles, or the bot's role being lower than the user's roles in the list."
                            });
                        }


                        return sendLog(client, newMember.guild.id, "YELLOW", "A user's roles were updated.", info);
                    }

                    //Check if the user is moderatabale.
                    if (oldMember.manageable !== newMember.manageable) {
                        console.log(newMember.manageable);
                        info.push({
                            name: "Manageable",
                            value: `${newMember.manageable || "No"}`
                        });
                    }

                    sendLog(client, newMember.guild.id, "YELLOW", "A user was updated.", info);
                }
            });

        //Don't think this really matters, it's just here for shits and giggles.
        }catch (error) {
            console.log("An error occured.");
        }

    }    
};