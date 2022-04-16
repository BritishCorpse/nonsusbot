const { MessageEmbed } = require("discord.js");
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const { saveServerConfig, getLanguages } = require(`${__basedir}/functions`);

module.exports = {
    name: ["config", "settings", "options"],
    description: "Change bot settings for this server.",
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "MANAGE_ROLES"],

    usage: [
        { tag: "list", checks: {is: "list"} },
        { tag: "set", checks: {is: "set"}, 
            next: [
                { tag: "option", checks: {isin: ["m_channel_id", "verify_channel_id", "log_channel_id", "levelup_channel_id", "welcome_channel_id", "suggestion_channel_id", "send_suggestion_channel_id", "counting_channel_id"]},
                    next: [
                        { tag: "channel-id", checks: {isinteger: null} }
                    ]
                },
                { tag: "option", checks: {isin: ["verify_role_id", "mute_role_id"]},
                    next: [
                        { tag: "role-id", checks: {isinteger: null} }
                    ]
                },
                { tag: "option", checks: {is: "prefix"},
                    next: [
                        { tag: "prefix", checks: {matchesfully: /[a-zA-Z0-9~`!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]{0,2}[~`!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]/} }
                    ]
                    
                },
                { tag: "option", checks: {isin: ["language"]},
                    next: [
                        { tag: "language", checks: {isin: getLanguages()} }
                    ]
                },
                { tag: "option", checks: {is: "detailed_logging"},
                    next: [
                        { tag: "boolean", checks: {isin: ["true", "false"]} }
                    ]
                }
            ]
        },
        { tag: "reset", checks: {is: "reset"}, 
            next: [
                { tag: "option",
                    checks: {
                        isin: [
                            "m_channel_id", "verify_channel_id", "log_channel_id",
                            "levelup_channel_id", "welcome_channel_id", "suggestion_channel_id",
                            "send_suggestion_channel_id", "counting_channel_id", "verify_role_id",
                            "prefix", "language", "detailed_logging", "mute_role_id",
                        ]
                    }
                }
            ]
        }
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        
        if (args[0] === "set") {
            if (args[1] in defaultServerConfig) {
                /* eslint-disable-next-line prefer-const */ // remove this comment if you edit newConfig
                let newConfig = args[2]; // by default, otherwise edit this later

                if (args[1] === "detailed_logging") {
                    if (args[2] === "true") {
                        message.client.serverConfig.get(message.guild.id)[args[1]] = newConfig;
                    }
                }
                // extra stuff to do
                // TODO: move this to background_tasks/verify.js
                if (args[1] === "verify_channel_id") {
                    const channel = await message.client.channels.fetch(newConfig);

                    channel.send("You will receive verification information here!");
                    message.channel.send("You will now receive verification information in the channel you chose.");
                }
               
                // set the config
                message.client.serverConfig.get(message.guild.id)[args[1]] = newConfig;

                // write it to the file
                saveServerConfig(message.client.serverConfig);

                message.channel.send(`Set value \`${args[1]}\` to \`${newConfig}\``);
            } else {
                message.channel.send("The value `" + args[1] + "` doesn't exist");
            }

        } else if (args[0] === "list") {
            // List all the configs

            let descriptionString = "";
            const config = message.client.serverConfig.get(message.guild.id);
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
                .setColor(randomColor)
                .setDescription(descriptionString);

            message.channel.send({embeds: [embed]});

        } else if (args[0] === "reset") {
            if (!(args[1] in defaultServerConfig)) {
                message.channel.send("Uh oh! Something went wrong :(");
                return;
            }
            
            // set the config
            message.client.serverConfig.get(message.guild.id)[args[1]] = defaultServerConfig[args[1]];

            // write it to the file
            saveServerConfig(message.client.serverConfig);

            message.channel.send(`Reset value \`${args[1]}\`.`);
        } else { // no option given, or incorrect option given
            message.channel.send("Options are: set, list, reset");
        }
    }
};
