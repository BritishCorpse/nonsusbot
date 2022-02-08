const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
//const { circularUsageOption } = require(`${__basedir}/functions`);
const { SelfRoleChannels, SelfRoleMessages, SelfRoleCategories, SelfRoleRoles } = require(`${__basedir}/db_objects`);


async function promptOptions(channel, user, promptMessage, options) {
    const rows = [];

    let index = 0;
    for (let i = 0; i < Math.ceil(options.length / 25); ++i) {
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
    // max time for collector
    const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});

    collector.on("end", () => {
        rows.forEach(row => {
            row.components[0].setDisabled(true);
        });
        message.edit({components: rows});
    });

    return new Promise((resolve) => {
        collector.on("collect", async interaction => {
            rows.forEach(row => {
                row.components[0].options.forEach(option => {
                    option.default = false;
                });
            });
            rows[Math.floor(Number.parseInt(interaction.values[0]) / 25)].components[0].options[Number.parseInt(interaction.values[0]) % 25].default = true;

            await interaction.update({components: rows});
            collector.stop();
            resolve(Number.parseInt(interaction.values[0]));
        });
    });
}


async function areYouSure(channel, user) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("no")
                .setLabel("NO")
                .setStyle("DANGER"),
            new MessageButton()
                .setCustomId("yes")
                .setLabel("YES")
                .setStyle("PRIMARY")
        );

    const message = await channel.send({
        content: "Are you sure?",
        components: [row]
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector
    const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});

    collector.on("end", () => {
        row.components.forEach(button => {
            button.setDisabled(true);
        });
        message.edit({components: [row]});
    });

    return new Promise((resolve) => {
        collector.on("collect", interaction => {
            interaction.deferUpdate();
            collector.stop();
            resolve(interaction.customId === "yes");
        });
    });
}


async function inputText(channel, user, promptMessage) {
    channel.send(promptMessage);
    const filter = message => message.author.id === user.id;
    const messages = await channel.awaitMessages({filter, time: 2_147_483_647, max: 1, errors: ["time"]});
    return messages.first().content;
}


function formatRole(role) {
    return `${role.emoji} ${role.name}`;
}


async function promptCategory(channel, user) {
    const categories = await SelfRoleCategories.findAll({
        where: {
            guild_id: channel.guild.id
        }
    });

    if (categories.length === 0) {
        await channel.send("There are no categories!");
        return;
    }

    const optionChosen = await promptOptions(channel, user,
        "Choose a category:", categories.map(category => category.name));

    return categories[optionChosen];
}


async function promptRole(channel, user, category) {
    const roles = await SelfRoleRoles.findAll({
        where: {
            category_id: category.id
        }
    });

    if (roles.length === 0) {
        await channel.send("There are no roles!");
        return;
    }

    const optionChosen = await promptOptions(channel, user,
        "Choose a role:", roles.map(role => formatRole(role)));

    return roles[optionChosen];
}


async function promptChannel(channel, user) {
    const allChannels = (await channel.guild.channels.fetch()).filter(channel => channel.type === "GUILD_TEXT");

    const optionChosen = await promptOptions(channel, user,
        "Enter the channel:", allChannels.map(channel => `#${channel.name}`));
    
    return allChannels.at(optionChosen);
}


async function createRole(channel, user, category) {
    // add role to category
    const roleName = await inputText(channel, user, "Enter the name of the role:");
    const emoji = await inputText(channel, user, "Enter the emoji for the role:");

    const role = await SelfRoleRoles.create({
        name: roleName,
        emoji: emoji,
        category_id: category.id
    });

    channel.send(`Added role ${formatRole(role)}!`);
}


async function editRole(channel, user, role) {
    while (true) {
        const optionChosen = await promptOptions(channel, user,
            `Edit the role ${formatRole(role)}:`, [
                "Edit emoji",
                "Rename",
                "Delete",
                "Finish"
            ]);

        if (optionChosen === 0) {
            const emoji = await inputText(channel, user, "Enter the emoji for the role:");

            role.update({
                emoji: emoji
            });
            
        } else if (optionChosen === 1) {
            const roleName = await inputText(channel, user, "Enter the name of the role:");

            role.update({
                name: roleName
            });

        } else if (optionChosen === 2) {
            // remove role from category
            if (await areYouSure(channel, user)) {
                role.destroy();
                channel.send("Deleted the role!");
                break;
            }
          
        } else if (optionChosen === 3) {
            channel.send("Finished editing the role.");
            break;
        }
    }
}


async function editCategory(channel, user, category) {
    while (true) {
        const optionChosen = await promptOptions(channel, user,
            `Edit the category ${category.name}:`, [
                "Add role",
                "Edit role",
                "Rename",
                "Delete",
                "Finish"
            ]);

        if (optionChosen === 0) {
            await createRole(channel, user, category);
        } else if (optionChosen === 1) {
            // show the roles in a drop down and then edit it
            const role = await promptRole(channel, user, category);

            if (role) {
                await editRole(channel, user, role);
            }

        } else if (optionChosen === 2) {
            const categoryName = await inputText(channel, user, "Enter the name of the category:");

            category.update({
                name: categoryName
            });

        } else if (optionChosen === 3) {
            // remove category
            if (await areYouSure(channel, user)) {
                category.destroy();
                channel.send("Deleted the category!");
                break;
            }
        } else if (optionChosen === 4) {
            channel.send("Finished creating the category.");
            break;
        }
    }
}


async function createCategory(channel, user) {
    // create a new category of self roles
    
    const categoryName = await inputText(channel, user, "Enter the name of the category:");

    const category = await SelfRoleCategories.create({
        name: categoryName,
        guild_id: channel.guild.id
    });

    channel.send("Created category ${category.name}!");
}


async function sendSelfRoleMessages(channel, save=false) {
    const categories = await SelfRoleCategories.findAll({
        where: {
            guild_id: channel.guild.id
        },
        include: ["roles"]
    });

    categories.forEach(async category => {
        const embed = new MessageEmbed()
            .setTitle(category.name)
            .setDescription(category.roles.map(role => formatRole(role)).join("\n"));
        
        const message = await channel.send({ embeds: [embed] });

        if (save) {
            SelfRoleMessages.create({
                message_id: message.id,
                category_id: category.id
            });
        }

        category.roles.forEach(async role => {
            await message.react(role.emoji);
        });
    });
}


module.exports = {
    name: "selfroles",
    description: "Manage self roles",
    userPermissions: [],

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

            while (true) {
                const optionChosen = await promptOptions(message.channel, message.author, "Here are your options:",[
                    "Add a category",
                    "Edit a category",
                    "Finish"
                ]);

                if (optionChosen === 0) {
                    await createCategory(message.channel, message.author);
                } else if (optionChosen === 1) {
                    // show the categories in a drop down and the edit it
                    const category = await promptCategory(message.channel, message.author);
                    if (category) {
                        await editCategory(message.channel, message.author, category);
                    }
                    
                } else if (optionChosen === 2) {
                    message.channel.send("Finished setting up self roles!");
                    break;
                }
            }
        } else if (args[0] === "preview") {
            sendSelfRoleMessages(message.channel);
        } else if (args[0] === "send") {
            // set the channel where the self roles are
            const selfRoleChannel = await promptChannel(message.channel, message.author);

            SelfRoleChannels.upsert({
                guild_id: message.guild.id,
                channel_id: selfRoleChannel.id
            });

            sendSelfRoleMessages(selfRoleChannel, true);
        }
    }
};
