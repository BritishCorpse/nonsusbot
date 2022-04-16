const { VerifyChannels, VerifyQuestions, VerifyRoles } = require(`${__basedir}/db_objects`);
// find the questions in the database.
// send the questions
// if the question count is 0, just give the user the role
// make a separate command for verifying the user if the question count isnt 0 
// in the command, make sure they have perms, then just pass through the user and the given role thats predtermined
// make a config for sending the users answers, maybe with a button to either accept or deny them?

module.exports = {
    name: "verification",
    async execute(client) {
        // NOTE: this requires the MESSAGE and REACTION partials to be enabled (in the client initialization)
       
        client.on("messageReactionAdd", async (reactionAddEvent, user) => {
            if (user.id === client.user.id) return; // don't give itself roles

            //try and find the actual "verify here" message in the database.
            const verifyMessage = await VerifyChannels.findOne({
                where: {
                    channel: reactionAddEvent.message.channel.id,
                    message_id: reactionAddEvent.message.id
                }
            }) || null;

            //Check if it is the correct message.
            if (verifyMessage === null) return console.log("This is not the message you are looking for.");

            //Check if it is the correct reaction.
            if (reactionAddEvent.emoji.name !== "✅") return console.log("This is not the emoji you are looking for.");

            //find all of the questions in the database.
            const verifyQuestions = await VerifyQuestions.findAll({
                where: {
                    guild_id: reactionAddEvent.message.guild.id
                }
            }) || null;

            //find the verification role, if it doesn't exist, return.
            //find the verify_channel_id, if it doesn't exist, try sending the answers to the log channel instead, if the log channel doesn't exist, return.
            const verifyRole = await VerifyRoles.findOne({
                where: {
                    guild_id: reactionAddEvent.message.guild.id,
                }
            }) || null;

            let verifyChannel;
            let logChannel;
            if (client.serverConfig.get(reactionAddEvent.message.guild.id).verify_channel_id) {
                verifyChannel = await client.channels.fetch(client.serverConfig.get(reactionAddEvent.message.guild.id).verify_channel_id) || null;
            } 
            if (client.serverConfig.get(reactionAddEvent.message.guild.id).log_channel_id) {
                logChannel = await client.channels.fetch(client.serverConfig.get(reactionAddEvent.message.guild.id).log_channel_id) || null;
            }

            //if the channel where to send verification isnt set, try to make it the config channel, and just return if it fails.
            if (verifyChannel === null) try {
                verifyChannel = logChannel;
            } catch (error) {
                return;
            }

            //if the verification role doesn't exist, make a cool logger embed, complain and don't do the rest of the file.
            if (verifyRole === null) {
                try {
                    const embed = {
                        color: "RED",
            
                        title: "Verification role not found",
            
                        author: {
                            name: "Logger.",
                            icon_url: client.user.displayAvatarURL(),
                            url: "https://talloween.github.io/graveyardbot/",
                        },
            
                        timestamp: new Date(),
            
                        footer: {
                            text: "Powered by Graveyard",
                        },
                    };


                    return logChannel.send({ embeds: [embed] });
                } catch (error) {
                    return console.log("An error was encountered while attemping to complain about the verification role not being found.");
                }
            }

            //this is the embed to show when a user gets verified.
            const successEmbed = {
                color: "GREEN",
        
                title: "A user was verified",
    
                fields: [
                    {
                        name: "Username",
                        value: user.username,
                    },
                    {
                        name: "ID",
                        value: user.id
                    }
                ],

                author: {
                    name: "Logger.",
                    icon_url: client.user.displayAvatarURL(),
                    url: "https://talloween.github.io/graveyardbot/",
                },
    
                timestamp: new Date(),
    
                footer: {
                    text: "Powered by Graveyard",
                },
            };

            //if there are no questions, just automatically verify the user.
            if (verifyQuestions === null || verifyQuestions.length < 1) {
                //find the verifyRole in the guilds cache
                const role = reactionAddEvent.message.guild.roles.cache.find(role => role.id === verifyRole.role_id) || null;
                console.log(role.name);

                if (role === null) return console.log("role not found");

                //try to give the role to the user.
                const member = reactionAddEvent.message.guild.members.cache.find(member => member.id === user.id);

                await member.roles.add(role);
                console.log(role.name);

                //send the success embed to the verifyChannel if everything works
                verifyChannel.send({ embeds: [successEmbed] });
            
            //this is for when there are questions.
            } else {
                //empty array called message, which will eventually hold all of the questions, get formatted and then sent to the verifyChannel
                const message = [];

                //verifyQuestions is an array, so we loop through that array and push each question's "question" property into the message array, and then format the message array to look nicer.
                for (let i = 0; i < verifyQuestions.length; i++) {
                    message.push(`\`${verifyQuestions[i].question}\``);
                } 

                //format the message to make it look a bit nicer in the user's dms.
                const conjoinedMessage = message.join("\n"); 

                try {
                    //tell the user the questions and that they have 60 minutes time to answer all of the questions.
                    user.send(`The moderators of ${reactionAddEvent.message.guild.name} have enabled verification in their server, and require you to answer these questions before being allowed entry.\nPlease reply to the questions below in ***one*** message. You have 60 minutes to answer.\n${conjoinedMessage}`).then(() => {
                        //this makes sure that we only receive messages from the person who actually reacted to the verification message.
                        const filter = m => user.id === m.author.id;

                        //start the message collector.
                        user.dmChannel.awaitMessages({ filter, time: 3600000, max: 1, errors: ["time"] })
                            .then(messages => {
                                if (message.length > 1024) return user.dmChannel.send("Your message is way too long! Try to make it less than 1000 characters.");
                                user.dmChannel.send("Thank you for your time. Please wait until you are verified by the moderators.");

                                const requestEmbed = {
                                    color: "YELLOW",
                            
                                    title: `${user.tag} is requesting verification`,

                                    description: `Answer(s):\n\`${messages.first().content}\``,
                    
                                    author: {
                                        name: "Logger.",
                                        icon_url: client.user.displayAvatarURL(),
                                        url: "https://talloween.github.io/graveyardbot/",
                                    },
                        
                                    timestamp: new Date(),
                        
                                    footer: {
                                        text: "Powered by Graveyard",
                                    },
                                };

                                //try sending the embed to the verifychannel and if it fails, send the embed to the log channel
                                try {
                                    verifyChannel.send({ embeds: [requestEmbed] });
                                } catch (error) {
                                    return console.error;
                                }
                            })
                            .catch(error => {
                                user.dmChannel.send("Did you fall asleep? You ran out of time. React to the verification message again to restart the verification process.");
                                console.log(`--------ERROR--------\nA user failed verification for this reason: ${error}`);
                            });
                    });

                } catch (error) {
                    return console.log("I ENCOUNTERED AN ERROR WHILE SENDING THE MESSAGE.");
                }
            }

        });
    }
};
