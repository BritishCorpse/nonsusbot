const { MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { VerifyQuestions, VerifyMessages, VerifyChannels, VerifyRoles } = require(`${__basedir}/db_objects`);

async function areYouSure(channel, user) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("yes")
                .setLabel("YES")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("no")
                .setLabel("NO")
                .setStyle("DANGER")
        );

    const message = await channel.send({
        content: "Are you sure?",
        components: [row]
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector
    //const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});
    const collector = message.createMessageComponentCollector({filter, time: 60000});

    return new Promise((resolve, reject) => {
        collector.on("end", () => {
            reject(new Error("no option chosen"));

            row.components.forEach(button => {
                button.setDisabled(true);
            });
            message.edit({components: [row]});
        });

        collector.on("collect", async interaction => {
            resolve(interaction.customId === "yes");

            await interaction.deferUpdate();
            collector.stop();
        });
    });
}

async function inputText(channel, user, promptMessage, maxLength=-1) {
    while (true) { /* eslint-disable-line no-constant-condition */
        channel.send(promptMessage);
        const filter = message => message.author.id === user.id;
        //const messages = await channel.awaitMessages({filter, time: 2_147_483_647, max: 1, errors: ["time"]});
        const messages = await channel.awaitMessages({filter, time: 60000, max: 1, errors: ["time"]});
        
        if (maxLength >= 0 && messages.first().content.length > maxLength) {
            await channel.send("The message you sent is too long, please try again!");
        } else {
            return messages.first().content;
        }
    }
}

async function promptOptions(channel, user, promptMessage, options) {
    const rows = [];

    let index = 0;
    for (let i = 0; i < Math.min(Math.ceil(options.length / 25), 5); ++i) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dropdown${i}`)
                    .addOptions(options.slice(index, index + 25).map((option, j) => {
                        return {label: `${index + j + 1}. ${option}`, value: (index + j).toString()};
                    }))
            );
        rows.push(row);
        index += 25;
    }

    const message = await channel.send({
        content: promptMessage,
        components: rows
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector is below (but reduced it to 60 seconds)
    //const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});
    const collector = message.createMessageComponentCollector({filter, time: 60000});

    return new Promise((resolve, reject) => {
        collector.on("end", () => {
            reject(new Error("no option chosen"));

            rows.forEach(row => {
                row.components[0].setDisabled(true);
            });
            message.edit({components: rows});
        });

        collector.on("collect", async interaction => {
            resolve(Number.parseInt(interaction.values[0]));

            rows.forEach(row => {
                row.components[0].options.forEach(option => {
                    option.default = false;
                });
            });
            rows[Math.floor(Number.parseInt(interaction.values[0]) / 25)].components[0].options[Number.parseInt(interaction.values[0]) % 25].default = true;

            await interaction.update({components: rows});
            collector.stop();
        });
    });
}

async function fellAsleep(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep? Please run the command again to continue.`);
}

async function asleepWarning(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep?`);
}

async function createQuestion(channel, user) {
    // create a new category of self roles
    
    const question = await inputText(channel, user, "Enter the question:", 256);

    await VerifyQuestions.create({
        guild_id: channel.guild.id,
        question: question
    });

    channel.send(`Added the question: "${question}" to the list.`);
}

async function promptQuestion(channel, user) {
    const questions = await VerifyQuestions.findAll({
        where: {
            guild_id: channel.guild.id
        },
    });

    if (questions.length === 0) {
        channel.send("There are no questions!");
        return;
    }

    const optionChosen = await promptOptions(channel, user,
        "Choose a question:", questions.map(question => question.question));

    console.log("HELLO");

    return questions[optionChosen];
}

async function editQuestion(channel, user, question) {
    let looping = true;
    while (looping) {
        const optionChosen = await promptOptions(channel, user,
            `Edit the question ${question.question}:`, [
                "Delete",
                "Edit question",
                "Finish"
            ]);


        if (optionChosen === 1) {
            const newQuestion = await inputText(channel, user, "Enter the new name of the question:", 256)
                .catch(() => {
                    asleepWarning(channel, user);
                });

            if (!newQuestion) return; // stop if user fell asleep

            question.update({
                question: newQuestion
            });

        } else if (optionChosen === 0) {
            const sure = await areYouSure(channel, user)
                .catch(() => {
                    looping = false; // stop if user fell asleep
                    asleepWarning(channel, user);
                });

            if (sure) {
                question.destroy({ where: { question: question } });
                channel.send("Deleted the question!");
                looping = false;
            }
        } else if (optionChosen === 2) {
            channel.send("Finished creating the category.");
            looping = false;
        }
    }
}

async function createMessage(channel, user) {
    const question = await inputText(channel, user, "Enter the message that users will see in the verification channel:", 256);

    await VerifyMessages.create({
        guild_id: channel.guild.id,
        message: question
    });

    channel.send(`Users will now see "${question}" in the verification message. NOTE: It is not possible to edit the text in an already sent verification message.`);
}

async function deleteMessage(channel, user, question) {
    let looping = true;
    while(looping){
        const sure = await areYouSure(channel, user)
            .catch(() => {
                looping = false; // stop if user fell asleep
                asleepWarning(channel, user);
            });

        if (sure) {
            question.destroy({ where: { question: question } });
            channel.send("Deleted the verify message!");
            looping = false;
        } else continue;
    }    
}

async function promptChannel(channel, user) {
    const allChannels = (await channel.guild.channels.fetch()).filter(channel => channel.type === "GUILD_TEXT");

    const optionChosen = await promptOptions(channel, user,
        "Enter the channel:", allChannels.map(channel => `#${channel.name}`));
    
    return allChannels.at(optionChosen);
}

async function promptDiscordRole(channel, user) {
    // this only prompts for roles that are under the user's highest role in the channel.guild
    // also this removes the @everyone role (@everyone role id is equal to guild id)
    const guildMember = await channel.guild.members.fetch(user);
    const botGuildMember = await channel.guild.members.fetch(channel.client.user);

    const allRolesUnderUser = (await channel.guild.roles.fetch())
        .filter(role => {
            return role.id !== channel.guild.id
                && role.comparePositionTo(
                    guildMember.roles.highest
                ) < 0
                && role.comparePositionTo(
                    botGuildMember.roles.highest
                ) < 0;
        });

    const optionChosen = await promptOptions(channel, user,
        "Enter the discord role:", allRolesUnderUser.map(role => `${role.name}`));
    
    return allRolesUnderUser.at(optionChosen);
}

module.exports = {
    name: ["verification", "verify"],
    description: "Manage the verification system",
    botPermissions: ["ADD_REACTIONS"],
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],

    usage: [
        { tag: "setup", checks: {is: "setup"} },
        { tag: "send", checks: {is: "send"} },
        { tag: "help", checks: {is: "help" } },
        { tag: "accept", checks: {is: "accept"}, next: [
            { tag: "user", checks: {isuseridinguild: null} }
        ]},
    ],

    async execute(message, args) {
        //const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        //const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        if (args[0] === "setup") {
            message.channel.send("NOTE: Please make sure that you've set up the appropriate configurations before running this command. Either the `verify_channel_id` config or the `log_channel_id` config should be set up.");

            let looping = true;
            while (looping) {
                const optionChosen = await promptOptions(message.channel, message.author, "Here are your options:",[
                    "Add a question",
                    "Edit a question",
                    "Add the embed message",
                    "Remove the embed message",
                    "Edit the role that the user will receive",
                    "Finish"
                ]).catch(() => {
                    fellAsleep(message.channel, message.author);
                    looping = false;
                });

                if (optionChosen === 0) {
                    await createQuestion(message.channel, message.author)
                        .catch(() => {
                            asleepWarning(message.channel, message.author);
                        });
                } else if (optionChosen === 1) {
                    // show the categories in a drop down and then edit it
                    const question = await promptQuestion(message.channel, message.author);

                    await editQuestion(message.channel, message.author, question)
                        .catch(() => {
                            asleepWarning(message.channel, message.author);
                        });
                } else if (optionChosen === 2) {
                    const tryForMessage = await VerifyMessages.findOne({
                        where: {
                            guild_id: message.guild.id
                        }
                    }) || null;

                    if (!tryForMessage) {
                        await createMessage(message.channel, message.author);
                    } else {
                        message.channel.send("Your guild already has a verify message!");
                    }
                } else if (optionChosen === 3) {
                    const tryForMessage = await VerifyMessages.findOne({
                        where: {
                            guild_id: message.guild.id
                        }
                    }) || null;

                    if (tryForMessage) {
                        await deleteMessage(message.channel, message.author, tryForMessage);
                    } else {
                        message.channel.send("Your guild does not have a verify message!");
                    }
                } else if (optionChosen === 4) {
                    const discordRole = await promptDiscordRole(message.channel, message.author);

                    const checkForRole = await VerifyRoles.findOne({
                        where: {
                            guild_id: message.guild.id,
                        }
                    }) || null;

                    if (checkForRole === null) {
                        await VerifyRoles.create({
                            guild_id: message.guild.id,
                            role_id: discordRole.id
                        });
                    } else {
                        await VerifyRoles.update({role_id: discordRole.id}, {where: {guild_id: message.guild.id}});

                        //inform the user of the updated orle.
                        message.channel.send(`The role ${discordRole.name} will be given to user's upon verification.`);
                    }
                } else if (optionChosen === 5) {
                    message.channel.send("Finished setting up the verification system!");
                    looping = false;
                }

            }

        } else if (args[0] === "send") {
            // set the channel where the self roles are to be sent
            const verifyChannel = await promptChannel(message.channel, message.author)
                .catch(() => {
                    fellAsleep(message.channel, message.author);
                });

            if (!verifyChannel) return; // stop if user fell asleep

            const tryForMessage = await VerifyMessages.findOne({
                where: {
                    guild_id: message.guild.id
                }
            });

            if (!tryForMessage) return message.channel.send("No verification message found! Aborting...");

            const embed = {
                title: tryForMessage.message,	
                footer: {
                    text: "Make sure you're allowing direct messages from server members before beginning verification.",
                },
            };

            verifyChannel.send({ embeds: [ embed ] }).then(async message => {
                const msgId = message.id;
                message.react("✅");

                await VerifyChannels.create({
                    guild_id: message.guild.id,
                    channel: verifyChannel.id,
                    message_id: msgId,
                });
            });

        } else if (args[0] === "help") {
            message.channel.send(   
                "Here is how the verification system works.\n" + 
                "Users will be presented with an embed containing text of your choosing\nThe embed message will also have a ✅ reaction. The user must press the ✅ to being the verification process." + 
                "\nHere is an example embed."
            );
            const embed = {
                title: "React to this message to begin the verification process!"
            };

            message.channel.send({ embeds: [embed] }).then(message => {
                message.react("✅");
            });

            message.channel.send(
                "Here's how the setup works.\n" +
                "Run the verify command with the argument of setup to begin!\n" + 
                "You will be prompted with a list of options, `Add question` `Remove question` `Add the embed message` `Remove the embed message` and `Finish`\n" +
                "If you press the `Add question` option and add a question, whenever the user begins the verification process, the bot will DM the user the given list of questions.\n" +
                "If your question list is empty, the user will be automatically verified without manual approval.\n" + 
                "However if there are questions in the list, when the user answers, a message will be sent to your server with the questions, where you will be able to manually verify the user.\n" + 
                "The `Add/Remove the embed message` options allow you to change the embeds title (see example embed).\nAnd the `Finish` option exits whatever menu you are in."
            );

            message.channel.send("***Before*** setting up the verification system, set the `verify_channel_id` config. `verify_channel_id` is the channel where you will receive the verification requests.");
        } else if (args[0] === "accept") {
            //this section is to manually verify members.
            //find the member
            const member = message.mentions.members.first();

            //tries to find the role in the database.
            const checkForRole = await VerifyRoles.findOne({
                where: {
                    guild_id: message.guild.id,
                }
            }) || null;

            //complain if the role is not found
            if (checkForRole === null) return message.channel.send("You do not have a verification role defined. Please run the setup and define the verification role.");
            
            //actually find the role in discord
            const roleInDiscord = message.guild.roles.cache.find(role => role.id === checkForRole.role_id) || null;
            //complain if the role doesnt exist in discord  
            if (roleInDiscord === null) return message.channel.send("You have defined the verification role but it no longer exists in the role list.");

            member.roles.add(roleInDiscord);
            message.channel.send(`Manually verified ${member.user.tag}`);

            //try to send verification log in the log channel
            let logChannel;
            if (message.client.serverConfig.get(message.guild.id).log_channel_id) {
                logChannel = await message.client.channels.fetch(message.client.serverConfig.get(message.guild.id).log_channel_id) || null;
            }

            //this is the embed to show when a user gets verified.
            const successEmbed = {
                color: "GREEN",
        
                title: "A user was verified",
    
                fields: [
                    {
                        name: "Username",
                        value: member.user.username,
                    },
                    {
                        name: "ID",
                        value: member.user.id
                    }
                ],

                author: {
                    name: "Logger.",
                    icon_url: message.client.user.displayAvatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },
    
                timestamp: new Date(),
    
                footer: {
                    text: "Powered by Graveyard",
                },
            };
            
            logChannel.send({ embeds: [successEmbed] });
        }
    }
};
