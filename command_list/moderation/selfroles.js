const { SelfRoleChannels } = require(`${__basedir}/db_objects`);
const { promptOptions, promptCategory, promptChannel, editCategory, createCategory, asleepWarning, fellAsleep, sendSelfRoleMessages } = require(`${__basedir}/utilities/menu.js`);

module.exports = {
    name: ["selfroles"],
    description: "Manage self roles",
    botPermissions: ["ADD_REACTIONS"],
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],

    usage: [
        { tag: "setup", checks: {is: "setup"} },
        { tag: "preview", checks: {is: "preview"} },
        { tag: "send", checks: {is: "send"} }
    ],

    async execute(message, args) {
        //const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        //const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        if (args[0] === "setup") {
            message.channel.send("You are setting up self roles!");

            let looping = true;
            while (looping) {
                const optionChosen = await promptOptions(message.channel, message.author, "Here are your options:",[
                    "Add a category",
                    "Edit a category",
                    "Finish"
                ]).catch(() => {
                    fellAsleep(message.channel, message.author);
                    looping = false;
                });

                if (optionChosen === 0) {
                    await createCategory(message.channel, message.author)
                        .catch(() => {
                            asleepWarning(message.channel, message.author);
                        });
                } else if (optionChosen === 1) {
                    // show the categories in a drop down and then edit it
                    const category = await promptCategory(message.channel, message.author)
                        .catch(() => {
                            asleepWarning(message.channel, message.author);
                        });

                    if (!category) continue;

                    await editCategory(message.channel, message.author, category)
                        .catch(() => {
                            asleepWarning(message.channel, message.author);
                        });
                    
                } else if (optionChosen === 2) {
                    message.channel.send("Finished setting up self roles!");
                    looping = false;
                }
            }

        } else if (args[0] === "preview") {
            sendSelfRoleMessages(message.channel, message.channel);

        } else if (args[0] === "send") {
            // set the channel where the self roles are to be sent
            const selfRoleChannel = await promptChannel(message.channel, message.author)
                .catch(() => {
                    fellAsleep(message.channel, message.author);
                });

            if (!selfRoleChannel) return; // stop if user fell asleep

            const success = sendSelfRoleMessages(message.channel, selfRoleChannel, true);
            // success is false if there are 0 categories
            if (success) {
                SelfRoleChannels.upsert({
                    guild_id: message.guild.id,
                    channel_id: selfRoleChannel.id
                });
            }
        }
    }
};
