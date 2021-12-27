const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const { saveServerConfig } = require(`${__basedir}/functions`);


function isValidGuildTextChannelId(guild, channelId) {
    const channel = guild.channels.cache.get(channelId);
    return channel !== undefined && channel.type === "GUILD_TEXT";
}


function isValidGuildRodeId(guild, roleId) {
    const role = guild.roles.cache.get(roleId);
    return role !== undefined;
}


function isValidPrefix(prefix) {
    // check if the length is max 3 (ex ab!) and that the last character is not a letter
    return prefix !== undefined && prefix !== "" && prefix.length < 4 && prefix.slice(-1) === prefix.slice(-1).toUpperCase();
}


module.exports = {
    name: "config",
    description: "Change bot settings for this server.",
    userPermissions: ["ADMINISTRATOR"],
    execute (message, args) {
        if (args[0] === "set") {
            if (args[1] in defaultServerConfig) {
                // special cases for each config option
                // (return; in case of error)

                if (['m_channel_id', 'verify_channel_id', 'log_channel_id'].includes(args[1])) {
                    if (!isValidGuildTextChannelId(message.guild, args[2])) {
                        message.channel.send("Channel ID is invalid.");
                        return;
                    }
                } else if (['verify_role_id', 'vip_role_id'].includes(args[2])) {
                    if (!isValidGuildRodeId(args[2])) {
                        message.channel.send("Role ID is invalid.");
                        return;
                    }
                } else if (args[1] === 'prefix') {
                    if (!isValidPrefix(args[2])) {
                        message.channel.send("Prefix is invalid");
                        return;
                    }
                }

                // extra stuff to do
                // TODO: move this to background_tasks/verify.js
                if (args[1] === "verify_channel_id") {
                    channel.send("Say 'yes' if you agree with the rules, and get verified!");
                    message.channel.send("Verify channel was setup. Edit the role to give using the config command, and manually edit the roles.");
                }
               
                // set the config
                message.client.serverConfig.get(message.guild.id)[args[1]] = args[2];

                // write it to the file
                saveServerConfig(message.client.serverConfig);

                message.channel.send("Set value `" + args[1] + "` to `" + args[2] + "`");
            } else {
                message.channel.send("The value `" + args[1] + "` doesn't exist")
            }

        } else if (args[0] === "list") {
            // List all the configs

            let descriptionString = "";
            let config = message.client.serverConfig.get(message.guild.id);
            for (const key in defaultServerConfig) {
                let value;
                if (config[key] === "" || config[key] === undefined) {
                    value = "not defined";
                } else {
                    value = config[key];
                }
              
                descriptionString += `${key}: \`${value}\`\n`;
            }

            const embed = new MessageEmbed()
                .setTitle("Configs for " + message.guild.name)
                .setColor("BLUE")
                .setDescription(descriptionString);

            message.channel.send({embeds: [embed]});

        } else { // no option given, or incorrect option given
            message.channel.send("Options are: set, list");
        }
    }
}
