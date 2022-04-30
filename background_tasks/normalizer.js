const { warningLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "normalizer",
    execute(client) {
        client.on("guildMemberUpdate", async (oldMember, newMember) => {
            //check if the username changed
            //since this is used for changing usernames to simple unicode text, we return if the displayName hasn't changed.
            if (newMember.displayName === oldMember.displayName) return;

            //check if the guild wants us to change illegal usernames.
            let allowNames;

            //if the config exists, find it
            if (client.serverConfig.get(newMember.guild.id).allow_illegal_names) {
                allowNames = await client.serverConfig.get(newMember.guild.id).allow_illegal_names;
            } 

            //if they arent allowing illegal names, return.
            if (allowNames === "false") {
                //try and normalize the username
                try {
                    //this is a way to "normalize"
                    const normalizedName = newMember.displayName.normalize("NFKC");

                    //sets the nickname to the new normalized name
                    await newMember.setNickname(normalizedName);
                } catch (error) {
                    warningLog("Unable to send a log", `${__dirname}/${__filename}.js`, "Most likely a PEBCAK permission error.", "GUILD-ERROR");
                    return;
                }

                // an embed to send in the log channel
                const updateEmbed = {
                    color: "YELLOW",

                    title: "Tried to normalize a displayname.",
                    
                    description: "This is done because you've disallowed illegal characters in your configuration.",

                    author: {
                        name: "Logger.",
                        icon_url: client.user.displayAvatarURL(),
                        url: "https://talloween.github.io/graveyardbot/",
                    },
            
                    fields: [
                        {
                            name: "New displayname",
                            value: `${newMember.displayName}`
                        },
                        {
                            name: "ID",
                            value: `${newMember.user.id}`
                        }
                    ],
                    timestamp: new Date(),
            
                    footer: {
                        text: "Powered by Graveyard",
                    },
                };

                //after we've updated the displayName, we're going to try and send a log to the logChannel.
                let logChannel;
                if (client.serverConfig.get(newMember.guild.id).log_channel_id) {
                    logChannel = await client.channels.fetch(client.serverConfig.get(newMember.guild.id).log_channel_id) || null;
                }

                //if they've defined the logchannel send the thingy there.
                if (logChannel !== null) {

                    try {
                        logChannel.send({ embeds: [updateEmbed] });
                    } catch (error) {
                        warningLog("Unable to send a log", `${__dirname}/${__filename}.js`, "Most likely a PEBCAK permission error.", "GUILD-ERROR");
                        return;
                    }

                }

            }
        });
    }
};