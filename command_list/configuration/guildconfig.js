/* Importing the functions from the utilities folder. */
const { promptOptions, asleepWarning, fellAsleep, promptConfig, promptConfigChannel, promptConfigRole, inputConfigText, inputText } = require(`${__basedir}/utilities`);
/* Importing the saveServerConfig function from the utilities folder. */
const { saveServerConfig } = require(`${__basedir}/utilities`);
/* Importing the default server config file. */
const defaultServerConfig = require(`${__basedir}/default_server_config.json`);
/* Importing the channelMention and roleMention builders from the @discordjs/builders package. */
const { channelMention, roleMention } = require("@discordjs/builders");


// here are the configs that the promptConfig function will need.
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
    "allow_illegal_names": "Simplify Names",
    "numbers_in_counting": "Allow Normal Messages In The Counting Channel",
    "profanity_filter": "Swear word filter",
    "allow_links": "Allow links in chat",
    "max_word_count": "Maximum word count in a message",
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
    "allow_illegal_names",
    "numbers_in_counting",
    "profanity_filter",
    "allow_links",
];

const numberConfigs = [
    "max_word_count"
];

/* Creating a dictionary of descriptions for each config option. */
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
    "prefix": "The prefix that the bot replies to. The default prefix is '_'.",
    "profanity_filter": "Used to ban swearing except in NSFW channels.",
    "allow_links": "Whether or not to allow users to send links such as https://talloween.github.io/graveyardbot/ in the chat.",
    "max_word_count": "The maximum words allowed per message, if a message has more than the maximum word count, it will be automatically deleted."
};

/**
 * It returns the key of an object that matches the value you pass to it
 * @param object - The object to search through
 * @param value - The value to search for.
 * @returns The key of the object that matches the value.
 */
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


module.exports = {
    /* Setting the name of the command. */
    name: ["guildconfig", "guildsettings", "guildoptions"],
    description: "Change your server's configurations!",
    /* Checking if the user has the permissions to manage channels, manage messages, and manage roles. */
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES", "MANAGE_ROLES"],
    usage: [],
    async execute(message) {
        let looping = true;
        while (looping) {
            /* Creating a promptOptions function that will ask the user what they would like to do. */
            const startOptionChosen = await promptOptions(message.channel, message.author, "What would you like to do:",[
                "Edit an option",
                "Help",
                "Finish"
            ]).catch(() => {
                fellAsleep(message.channel, message.author);
                looping = false;
            });

            // edit an option
            if (startOptionChosen === 0) {
                const editOptionChosen = await promptConfig(message.channel, message.author).catch(() => {
                    console.error();
                    asleepWarning(message.channel, message.author);
                });

                /* Getting the key of the value of the editOptionChosen variable. */
                const trueConfig = await getKeyByValue(simpleConfigs, editOptionChosen);

                if (numberConfigs.includes(trueConfig)) {
                    let looping1 = true;
                    while(looping1 === true) {
                        /* Creating a variable called numberOptionChosen and setting it to the result of the promptOptions
                        function. */
                        const numberOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                            "Change the number this option is set to",
                            "View the number this option is set to",
                            "Reset this option",
                            "Back to menu",
                        ]).catch(() => {
                            console.error();
                            asleepWarning(message.channel, message.author);
                        });
    
                        /* Checking if the user has chosen the option to edit the maximum word length. If they have, it will
                        ask them to enter the new maximum word length. */
                        if (numberOptionChosen === 0) {
                            let looping = true;
                            while (looping === true) {
                                const numberChosen = await inputText(message.channel, message.author, "Please enter the new maximum word length", 1000000000);
    
                                const newConfig = numberChosen;
    
                                if (isNaN(newConfig)) {
                                    return message.channel.send("Input entered is not a number.");
                                } else {
                                    // set the config
                                    message.client.serverConfig.get(message.guild.id)[trueConfig] = newConfig;
                                    
                                    // write it to the file
                                    saveServerConfig(message.client.serverConfig);
    
                                    message.channel.send(`${editOptionChosen} was set to the number ${newConfig}`);
    
                                    looping = false;
                                }
                            }
                        }
    
                        /* Checking if the numberOptionChosen is equal to 1. If it is, it will check if the trueConfig is bound
                        to a number. If it is, it will send the number it is bound to. If it is not, it will send a message
                        saying it is not bound to a number. */
                        if (numberOptionChosen === 1) {
                            const channel = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;
    
                            if (channel === null) {
                                message.channel.send(`${editOptionChosen} is not currently bound to a number.`);
                                continue;   
                            } else {
                                message.channel.send(`${editOptionChosen} is currently bound to the number ${channel}`);
                                continue;
                            }
                        }
    
                        /* Resetting the config to the default value. */
                        if (numberOptionChosen === 2) {
                            // reset the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was reset.`);
                            continue;
                        }
    
                        /* Checking if the numberOptionChosen is equal to 3. If it is, it sets looping1 to false. */
                        if (numberOptionChosen === 3) {
                            // I'm pretty sure this just goes to the next iteration of the loop
                            looping1 = false;
                        }
                    }

                }
                // now we check to see if it is in the channelConfigs array.
                if (channelConfigs.includes(trueConfig)) {
                    let looping1 = true;
                    while (looping1 === true) {
                        /* Asking the user to choose an option from a list of options. */
                        const channelOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                            "Change the channel this option is set to",
                            "View the channel this option is set to",
                            "Reset this option",
                            "Back to menu"
                        ]).catch(() => {
                            console.error();
                            asleepWarning(message.channel, message.author);
                        });

                        /* Setting the config to a channel. */
                        if (channelOptionChosen === 0) {
                            const channelChosen = await promptConfigChannel(message.channel, message.author);

                            const newConfig = channelChosen.id;

                            // set the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = newConfig;

                            // write it to the file
                            saveServerConfig(message.client.serverConfig);

                            message.channel.send(`${editOptionChosen} was set to the channel ${channelMention(newConfig)}`);
                            continue;
                        }

                        /* Checking if the user chose the first option, which is to view the current channel. If they did, it
                        will check if the channel is null, which means it is not bound to a channel. If it is not bound to a
                        channel, it will send a message saying that it is not bound to a channel. If it is bound to a
                        channel, it will send a message saying that it is bound to a channel. */
                        if (channelOptionChosen === 1) {
                            const channel = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;

                            if (channel === null) {
                                message.channel.send(`${editOptionChosen} is not currently bound to a channel.`);
                                continue;   
                            } else {
                                message.channel.send(`${editOptionChosen} is currently bound to the channel ${channelMention(channel)}`);
                                continue;
                            }
                        }

                        /* Resetting the config to the default value. */
                        if (channelOptionChosen === 2) {
                            // reset the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];

                            // write it to the file
                            saveServerConfig(message.client.serverConfig);

                            message.channel.send(`${editOptionChosen} was reset.`);
                            continue;
                        }

                        /* Checking if the user has chosen the option to exit the program. If they have, it will set the
                        looping1 variable to false, which will cause the program to exit. */
                        if (channelOptionChosen === 3) {
                            looping1 = false;
                        }
                    }
                    
                }

                // here we check to see if it's a role config
                if (roleConfigs.includes(trueConfig)) {
                    let looping1 = true;
                    while (looping1 === true) {
                        /* Creating a variable called roleOptionChosen and assigning it the value of the result of the
                        promptOptions function. */
                        const roleOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                            "Change the role this option is set to",
                            "View the role this option is set to",
                            "Reset this option",
                            "Back to menu"
                        ]).catch(() => {
                            console.error();
                            asleepWarning(message.channel, message.author);
                        });
    
                        /* Setting the config to the role chosen. */
                        if (roleOptionChosen === 0) {
                            const roleChosen = await promptConfigRole(message.channel, message.author);
    
                            const newConfig = roleChosen.id;
    
                            // set the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = newConfig;
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was set to the role ${roleMention(newConfig)}`);
                            looping1 = false;
                        }

                        /* Checking if the roleOptionChosen is equal to 1. If it is, it will then check if the role is null. If
                        it is, it will send a message saying that the role is not bound to a role. If it is not null, it
                        will send a message saying that the role is bound to a role. */
                        if (roleOptionChosen === 1) {
                            const role = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;
    
                            if (role === null) {
                                message.channel.send(`${editOptionChosen} is not currently bound to a role.`);
                                continue;   
                            } else {
                                message.channel.send(`${editOptionChosen} is currently bound to the role ${roleMention(role)}`);
                                continue;
                            }
                        }
    

                        /* Resetting the config to the default value. */
                        if (roleOptionChosen === 2) {
                            // reset the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was reset.`);
                            continue;
                        }
    
                        /* Checking to see if the user has chosen the role of JavaScript. If they have, it will set the
                        looping1 variable to false, which will cause the loop to end. */
                        if (roleOptionChosen === 3) {
                            // I'm pretty sure this just goes to the next iteration of the loop
                            looping1 = false;
                        }
                    }
                }
                    

                // check if its a boolean config
                if (booleanConfigs.includes(trueConfig)) {
                    let looping1 = true;
                    while (looping1 === true) {
                        /* Asking the user to choose an option from the list of options. */
                        const booleanOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                            "Change the value of this option",
                            "View the value of this option",
                            "Reset this option",
                            "Back to menu"
                        ]).catch(() => {
                            console.error();
                            asleepWarning(message.channel, message.author);
                        });
    
                        /* Setting the config to true or false. */
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
                            continue;
                        }
    

                        /* Checking if the option chosen is a boolean option. If it is, it will check if the option is defined.
                        If it is not defined, it will send a message saying that it is not defined. If it is defined, it
                        will send a message saying what the option is currently set to. */
                        if (booleanOptionChosen === 1) {
                            const trueOrFalse = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;
    
                            if (trueOrFalse === null) {
                                message.channel.send(`${editOptionChosen} is not currently defined.`);
                                continue;   
                            } else {
                                message.channel.send(`${editOptionChosen} is currently ${trueOrFalse}`);
                            }
                        }
    
                        /* Resetting the config to the default value. */
                        if (booleanOptionChosen === 2) {
                            // reset the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was reset.`);
                        }
    
                        // back to meny
                        /* Checking if the user has chosen the third option, if they have, it will set the looping1 variable to
                        false, which will stop the loop. */
                        if (booleanOptionChosen === 3) {
                            looping1 = false;
                        }
                    }
                    
                }

                if (trueConfig === "prefix") {
                    let looping1 = true;
                    while (looping1 === true) {
                        /* Asking the user to choose an option from the list of options. */
                        const prefixOptionChosen = await promptOptions(message.channel, message.author, `You are editing the option ${editOptionChosen}.\n${configDescriptions[trueConfig]}`,[
                            "Change the value of this optiom",
                            "View the value of this option",
                            "Reset this option",
                            "Back to menu"
                        ]).catch(() => {
                            console.error();
                            asleepWarning(message.channel, message.author);
                        });
    
                        /* Setting the prefix to the user's input. */
                        if (prefixOptionChosen === 0) {
                            const prefix = await inputConfigText(message.channel, message.author, "Enter the new prefix:", 5);
    
                            // set the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = prefix;
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was set to ${prefix}`);                        
                        }
    
                        /* Checking if the prefixOptionChosen is equal to 1. If it is, it will then check if the prefix is
                        null. If it is, it will send a message saying that the prefix is not currently defined. If it is not
                        null, it will send a message saying that the prefix is currently the prefix. */

                        // ^^^ i mean close enough i guess??
                        if (prefixOptionChosen === 1) {
                            const prefix = await message.client.serverConfig.get(message.guild.id)[trueConfig] || null;
    
                            if (prefix === null) {
                                message.channel.send(`${editOptionChosen} is not currently defined.`);
                                continue;   
                            } else {
                                message.channel.send(`${editOptionChosen} is currently ${prefix}`);
                            } 
                        }
    
                        /* Resetting the config to the default value. */
                        if (prefixOptionChosen === 2) {
                            // reset the config
                            message.client.serverConfig.get(message.guild.id)[trueConfig] = defaultServerConfig[trueConfig];
    
                            // write it to the file
                            saveServerConfig(message.client.serverConfig);
    
                            message.channel.send(`${editOptionChosen} was reset.`);   
                        }

                        if (prefixOptionChosen === 3) {
                            looping1 = false;
                        }
                    }

                }
            }

            // finish
            /* Checking if the user has chosen the option to exit the options menu. If they have, it will exit the
            loop and the options menu. */
            else if (startOptionChosen === 2) {
                message.channel.send("Exiting the options menu.");
                looping = false;
                break;
            }

            else if (startOptionChosen === 1) {
                message.channel.send("Welcome to the options menu. Here you can change options for your server. For example: where to send logs, the language I will speak, where to send verification messages, and many more.\nClick on the dropdown below to begin.");
                continue;
            }
        }
        
    }
};

// thanks mintlify doc writer