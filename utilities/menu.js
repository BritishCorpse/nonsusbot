const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const { SelfRoleMessages, SelfRoleCategories, SelfRoleRoles } = require(`${__basedir}/db_objects`);

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

            message.delete();
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

function formatRole(role) {
    return `${role.emoji} ${role.name}`;
}

async function promptCategory(channel, user) {
    const categories = await SelfRoleCategories.findAll({
        where: {
            guild_id: channel.guild.id
        },
        include: ["roles"]
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

async function inputEmoji(channel, user) {
    let emoji;

    let looping = true;
    let testMessage;

    while (looping) {
        emoji = await inputText(channel, user, "Enter the emoji for the role:");

        testMessage = await channel.send("Testing for emoji...");
        looping = false;
        await testMessage.react(emoji)
            .catch(() => {
                testMessage.edit(`"${emoji}" is not a valid emoji! Please try again!`);
                looping = true;
            });
    }

    testMessage.delete();

    return emoji;
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

async function createRole(channel, user, category) {
    // add role to category
    const roleName = await inputText(channel, user, "Enter the name of the role:", 20);
    const emoji = await inputEmoji(channel, user);
    const discordRole = await promptDiscordRole(channel, user);

    const role = await SelfRoleRoles.create({
        name: roleName,
        emoji: emoji,
        category_id: category.id,
        role_id: discordRole.id
    });

    channel.send(`Added the role ${formatRole(role)}!`);
}

async function editRole(channel, user, role) {
    let looping = true;
    while (looping) {
        const optionChosen = await promptOptions(channel, user,
            `Edit the role ${formatRole(role)}:`, [
                "Edit emoji",
                "Rename",
                "Change the discord role",
                "Delete",
                "Finish"
            ]);

        if (optionChosen === 0) {
            const emoji = await inputEmoji(channel, user);

            role.update({
                emoji: emoji
            });
            
        } else if (optionChosen === 1) {
            const roleName = await inputText(channel, user, "Enter the name of the role:", 20);

            role.update({
                name: roleName
            });

        } else if (optionChosen === 2) {
            const discordRole = await promptDiscordRole(channel, user);

            role.update({
                role_id: discordRole.id
            });
        } else if (optionChosen === 3) {
            // remove role from category
            if (await areYouSure(channel, user)) {
                role.destroy();
                channel.send("Deleted the role!");
                looping = false;
            }
          
        } else if (optionChosen === 4) {
            channel.send("Finished editing the role.");
            looping = false;
        }
    }
}

async function editCategory(channel, user, category) {
    let looping = true;
    while (looping) {
        const optionChosen = await promptOptions(channel, user,
            `Edit the category ${category.name}:`, [
                "Add role",
                "Edit role",
                "Edit color",
                "Edit ordering",
                "Rename",
                "Delete",
                "Finish"
            ]);

        if (optionChosen === 0) {
            if (category.roles.length >= 20) {
                await channel.send("You cannot have more than 20 roles per category!");
                continue;
            }

            await createRole(channel, user, category)
                .catch(() => {
                    looping = false; // stop if user fell asleep
                    asleepWarning(channel, user);
                });
        } else if (optionChosen === 1) {
            // show the roles in a drop down and then edit it
            const role = await promptRole(channel, user, category)
                .catch(() => {
                    asleepWarning(channel, user);
                });

            if (!role) return; // stop if user fell asleep

            await editRole(channel, user, role);

        } else if (optionChosen === 2) {
            let color;
            let looping2 = true;
            while (looping2) {
                color = await inputText(channel, user, "Pick a color on https://colorpicker.me/ and copy the hex code:")
                    .catch(() => {
                        asleepWarning(channel, user);
                        looping2 = false;
                    });
                
                if (/#[0-9a-fA-F]/.test(color)) looping2 = false;

                if (!looping2) break;

                await channel.send("That is not a valid hex code! It must be in the format `#abcdef`.");
            }

            if (!/#[0-9a-fA-F]/.test(color)) return; // stop if the user fell asleep

            category.update({
                color: color
            });
        } else if (optionChosen === 3) {
            const orderChosen = await promptOptions(channel, user,
                "How would you like to order the roles?", [
                    "By the order they were entered (default)",
                    "Alphabetically"
                ]);

            category.update({
                roleOrder: orderChosen
            });

        } else if (optionChosen === 4) {
            const categoryName = await inputText(channel, user, "Enter the name of the category:", 20)
                .catch(() => {
                    asleepWarning(channel, user);
                });

            if (!categoryName) return; // stop if user fell asleep

            category.update({
                name: categoryName
            });

        } else if (optionChosen === 5) {
            // remove category
              
            const sure = await areYouSure(channel, user)
                .catch(() => {
                    looping = false; // stop if user fell asleep
                    asleepWarning(channel, user);
                });

            if (sure) {
                category.roles.forEach(role => {
                    role.destroy();
                });
                category.destroy();
                channel.send("Deleted the category!");
                looping = false;
            }
        } else if (optionChosen === 6) {
            channel.send("Finished creating the category.");
            looping = false;
        }
    }
}

async function createCategory(channel, user) {
    // create a new category of self roles
    
    const categoryName = await inputText(channel, user, "Enter the name of the category:", 20);

    const category = await SelfRoleCategories.create({
        name: categoryName,
        guild_id: channel.guild.id,
        color: "DEFAULT", // default color string
        roleOrder: 0,     // default order by input order
    });

    channel.send(`Created category ${category.name}!`);
}


async function sendSelfRoleMessages(channel, targetChannel, save=false) {
    const categories = await SelfRoleCategories.findAll({
        where: {
            guild_id: channel.guild.id
        },
        include: ["roles"]
    });

    if (categories.length === 0) {
        channel.send("There are no categories!");
        return false;
    }

    categories.forEach(async category => {
        const roles = category.roles;
        if (category.roleOrder === 0) { // order they were entered
            roles.sort((roleA, roleB) => roleA.id - roleB.id);
        } else if (category.roleOrder === 1) { // alphabetically
            // do nothing, as it automatically sorts alphabetically
        }

        const embed = new MessageEmbed()
            .setTitle(category.name)
            .setDescription(
                roles
                    .map(role => formatRole(role))
                    .join("\n")
            )
            .setColor(category.color);
        
        const message = await targetChannel.send({ embeds: [embed] });

        if (save) {
            SelfRoleMessages.create({
                message_id: message.id,
                category_id: category.id,
                channel_id: targetChannel.id
            });
        }

        category.roles.forEach(async role => {
            await message.react(role.emoji);
        });
    });

    return true;
}

async function asleepWarning(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep?`);
}

async function fellAsleep(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep? Please run the command again to continue.`);
}

module.exports = {
    areYouSure,
    inputText,
    promptOptions,
    formatRole,
    promptCategory,
    promptRole,
    promptChannel,
    inputEmoji,
    promptDiscordRole,
    createRole,
    editRole,
    editCategory,
    createCategory,
    sendSelfRoleMessages,
    asleepWarning,
    fellAsleep
};
