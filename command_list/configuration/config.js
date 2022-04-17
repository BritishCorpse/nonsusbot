const { promptOptions, asleepWarning, fellAsleep, promptConfig, promptConfigChannel, promptConfigRole, inputConfigText } = require(`${__basedir}/utilities`);
const { saveServerConfig } = require(`${__basedir}/utilities`);
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
const { channelMention, roleMention } = require("@discordjs/builders");

//here are the configs that the promptConfig function will need.
const simpleConfigs = {
    "m_channel_id": "Spam Channel",
    "log_channel_id": "Log Channel",
    "verify_channel_id": "Verification Channel",
    "verify_role_id": "Verification Role",
    "welcome_channel_id": "Welcome Channel",
    "levelup_channel_id": "Leveling Channel",
    "suggestion_channel_id": "Receive Suggestions Channel",
    "send_suggestion_channel_id": "Send Suggestions Channel",
    "counting_channel_id": "Counting Channel",
    "prefix": "Prefix",
    "language": "Language",
    "detailed_logging": "In-depth Logging",
    "allow_illegal_names": "Simplify Names"
};

const channelConfigs = [
    "m_channel_id",
    "log_channel_id",
    "verify_channel_id",
    "welcome_channel_id",
    "levelup_channel_id",
    "suggestion_channel_id",
    "send_suggestion_channel_id",
    "counting_channel_id",
];

const roleConfigs = [
    "verify_role_id"
];

const booleanConfigs = [
    "detailed_logging",
    "allow_illegal_names"
];

const configDescriptions = {
    "m_channel_id": "This is the channel where users can only the send the letter m.",
    "log_channel_id": "This is the channel where you will receive audit log information, such as deleted messages, role updates and bans.",
    "verify_channel_id": "This is the channel where you will receive information about the verification system, such as verification requests and successful verifications. Don't worry about this option if you haven't set up a verification system yet.",
    "verify_role_id": "This the role that users will receive upon completing verification.",
    "welcome_channel_id": "This is the channel where welcome and goodbye messages will be sent when a user joins or leaves the server.",
    "levelup_channel_id": "This is the channel where it will be informed when a user levels up.",
    "suggestion_channel_id": "The Receive Suggestions and Send Suggestions Channels are the channels where users will be able to send suggestions, and then other users will vote on it.",
    "send_suggestion_channel_id": "The Receive Suggestions and Send Suggestions Channels are the channels where users will be able to send suggestions, and then other users will vote on it.",
    "counting_channel_id": "This is the channel where users will count n+1 until someone fails and the count gets set back to 1.",
    "detailed_logging": "Whether or not to send detailed information to the logging channel, such as a channel's pinned messages being updated.",
    "allow_illegal_names": "If a user has 'un-pingable' font in their name, change their name to standard unicode text. For example: 𝔐𝔶𝔘𝔰𝔢𝔯𝔫𝔞𝔪𝔢1 to MyUsername1",
    "language": "The language that is displayed when running commands.",
    "prefix": "The prefix that the bot replies to. The default prefix is '_'."
};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


module.exports = {
    name: ["config", "settings", "options"],
    description: "Change your server's configurations!",
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "MANAGE_ROLES"],
    usage: [],
    async execute(message) {
        message.channel.send("Welcome to the options menu. Here you can change options for your server. For example: where to send logs, the language I will speak, where to send verification messages, and many more.\nClick on the dropdown below to begin.");

        let looping = true;
        while (looping) {
            //this is the start screen where we let the user decide what to do
            const startOptionChosen = await promptOptions(message.channel, message.author, "What would you like to do:",[
                "Edit an option",
                "Help",
                "Finish"
            ]).catch(() => {
                fellAsleep(message.channel, message.author);
                looping = false;
            });

            //edit an option
            if (startOptionChosen === 0) {
                const editOptionChosen = await promptConfig(message.channel, message.author).catch(() => {
                    console.error();
                    asleepWarning(message.channel, message.author);
                });

                //find the "true" name of the config by using this cool function i found on stackoverflow.
                const trueConfig = await getKeyByValue(simpleConfigs, editOptionChosen);

                //now we check to see if it is in the channelConfigs array.
                if (channelConfigs.includes(trueConfig)) {
                    //prompt the user with what to with the option they chose
                    const channelOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                        "Change the channel this option is set to",
                        "View the channel this option is set to",
                        "Reset this option",
                        "Back to menu"
                    ]).catch(() => {
                        console.error();
                        asleepWarning(message.channel, message.author);
                    });

                    //"Change the channel this option is set to"
                    if (channelOptionChosen === 0) {
                        const channelChosen = await promptConfigChannel(message.channel, message.author);

                        const newConfig = channelChosen.id;

                        // set the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = newConfig;

                        // write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was set to the channel ${channelMention(newConfig)}`);
                    }

                    //"View the channel this option is set to"
                    if (channelOptionChosen === 1) {
                        const channel = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;

                        if (channel === null) {
                            message.channel.send(`${editOptionChosen} is not currently bound to a channel.`);
                            continue;   
                        } else {
                            message.channel.send(`${editOptionChosen} is currently bound to the channel ${channelMention(channel)}`);
                        }
                    }

                    //"Reset this option"
                    if (channelOptionChosen === 2) {
                        //reset the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];

                        //write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was reset.`);
                    }

                    //"Back to menu"
                    if (channelOptionChosen === 3) {
                        //im pretty sure this just goes to the next iteration of the loop
                        continue;
                    }
                }

                //here we check to see if it's a role config
                if (roleConfigs.includes(trueConfig)) {
                    const roleOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                        "Change the role this option is set to",
                        "View the role this option is set to",
                        "Reset this option",
                        "Back to menu"
                    ]).catch(() => {
                        console.error();
                        asleepWarning(message.channel, message.author);
                    });

                    //"Change the channel this option is set to"
                    if (roleOptionChosen === 0) {
                        const roleChosen = await promptConfigRole(message.channel, message.author);

                        const newConfig = roleChosen.id;

                        // set the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = newConfig;

                        // write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was set to the role ${roleMention(newConfig)}`);
                    }

                    //"View the role this option is set to"
                    if (roleOptionChosen === 1) {
                        const role = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;

                        if (role === null) {
                            message.channel.send(`${editOptionChosen} is not currently bound to a role.`);
                            continue;   
                        } else {
                            message.channel.send(`${editOptionChosen} is currently bound to the role ${roleMention(role)}`);
                        }
                    }

                    //"Reset this option"
                    if (roleOptionChosen === 2) {
                        //reset the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];

                        //write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was reset.`);
                    }

                    //"Back to menu"
                    if (roleOptionChosen === 3) {
                        //im pretty sure this just goes to the next iteration of the loop
                        continue;
                    }
                }

                //check if its a boolean config
                if (booleanConfigs.includes(trueConfig)) {
                    const booleanOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                        "Change the value of this option",
                        "View the value of this option",
                        "Reset this option",
                        "Back to menu"
                    ]).catch(() => {
                        console.error();
                        asleepWarning(message.channel, message.author);
                    });

                    //"Change the value of this option.",
                    if (booleanOptionChosen === 0) {
                        let trueOrFalse = await promptOptions(message.channel, message.author, "You can set the option to either True or False:",[
                            "True",
                            "False"
                        ]);

                        if (trueOrFalse === 0) trueOrFalse = true;
                        if (trueOrFalse === 1) trueOrFalse = false;

                        // set the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = trueOrFalse;

                        // write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was set to ${trueOrFalse}`);
                    }

                    //list the value,
                    if (booleanOptionChosen === 1) {
                        const trueOrFalse = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;

                        if (trueOrFalse === null) {
                            message.channel.send(`${editOptionChosen} is not currently defined.`);
                            continue;   
                        } else {
                            message.channel.send(`${editOptionChosen} is currently ${trueOrFalse}`);
                        }
                    }

                    //reset config
                    if (booleanOptionChosen === 2) {
                        //reset the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];

                        //write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was reset.`);
                    }

                    //back to meny
                    if (booleanOptionChosen === 3) {
                        continue;
                    }
                }

                if (trueConfig === "prefix") {
                    const prefixOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                        "Change the value of this optiom",
                        "View the value of this option",
                        "Reset this option",
                        "Back to menu"
                    ]).catch(() => {
                        console.error();
                        asleepWarning(message.channel, message.author);
                    });

                    if (prefixOptionChosen === 0) {
                        const prefix = await inputConfigText(message.channel, message.author, "Enter the new prefix:", 5);

                        // set the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = prefix;

                        // write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was set to ${prefix}`);                        
                    }

                    if (prefixOptionChosen === 1) {
                        const prefix = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;

                        if (prefix === null) {
                            message.channel.send(`${editOptionChosen} is not currently defined.`);
                            continue;   
                        } else {
                            message.channel.send(`${editOptionChosen} is currently ${prefix}`);
                        } 
                    }

                    if (prefixOptionChosen === 2) {
                        //reset the config
                        message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];

                        //write it to the file
                        saveServerConfig(message.client.serverConfig);

                        message.channel.send(`${editOptionChosen} was reset.`);   
                    }
                }
            }

            //finish
            else if (startOptionChosen === 2) {
                message.channel.send("Exiting the options menu.");
                looping = false;
                break;
            }
        }
        
    }
};
