const { MessageEmbed } = require("discord.js");
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const { saveServerConfig } = require(`${__basedir}/functions`);


module.exports = {
    name: ["config", "settings", "options"],
    description: "Change bot settings for this server.",
    userPermissions: ["ADMINISTRATOR"],

    usage: [
        { tag: "list", checks: {is: "list"} },
        { tag: "set", checks: {is: "set"}, 
            next: [
                { tag: "option", checks: {isin: ["m_channel_id", "verify_channel_id", "log_channel_id", "levelup_channel_id", "welcome_channel_id", "suggestion_channel_id", "send_suggestion_channel_id", "counting_channel_id"]},
                    next: [
                        { tag: "channel-id", checks: {isinteger: null} }
                    ]
                },
                { tag: "option", checks: {isin: ["verify_role_id"]},
                    next: [
                        { tag: "role-id", checks: {isinteger: null} }
                    ]
                },
                { tag: "option", checks: {is: "prefix"},
                    next: [
                        { tag: "prefix", checks: {matchesfully: /[a-zA-Z0-9~`!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]{0,2}[~`!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]/} }
                    ]
                    
                }
            ]
        }
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        if (args[0] === "set") {
            if (args[1] in defaultServerConfig) {
                /* eslint-disable-next-line prefer-const */ // remove this comment if you edit newConfig
                let newConfig = args[2]; // by default, otherwise edit this later

                // extra stuff to do
                // TODO: move this to background_tasks/verify.js
                if (args[1] === "verify_channel_id") {
                    const channel = await message.client.channels.fetch(newConfig);

                    channel.send("Say 'yes' if you agree with the rules, and get verified!");
                    message.channel.send("Verify channel was setup. Edit the role to give using the config command, and manually edit the roles.");
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

        } else { // no option given, or incorrect option given
            message.channel.send("Options are: set, list");
        }
    }
};
