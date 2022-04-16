const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { AutoRoleRoles } = require(`${__basedir}/db_objects`);

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

async function promptRole(channel, user, guildId) {
    const roles = await AutoRoleRoles.findAll({
        where: {
            guild_id: guildId
        }
    });

    if (roles.length === 0) {
        await channel.send("There are no roles!");
        return;
    }

    const optionChosen = await promptOptions(channel, user,
        "Choose a role:", roles.map(role => `${role.role_name}`));

    return roles[optionChosen];
}

async function fellAsleep(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep? Please run the command again to continue.`);
}

async function asleepWarning(channel, user) {
    channel.send(`Hello ${user}, did you fall asleep?`);
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

async function createRole(channel, user, guildId) {
    // add role to category
    const discordRole = await promptDiscordRole(channel, user);

    const role = await AutoRoleRoles.create({
        guild_id: guildId,
        role_id: discordRole.id,
        role_name: discordRole.name
    });


    channel.send(`Added the role ${role.role_name}!`);
}


module.exports = {
    name: ["autoroles"],
    description: "Assign certain roles to be given to users when they join the server!",
    //please fill this. thank you
    usage: [],
    botPermissions: ["ADD_REACTIONS"],
    userPermissions: ["MANAGE_CHANNELS", "MANAGE_ROLES"],

    async execute(message) {
        message.channel.send("You are setting up auto roles!");
        
        let looping = true;
        while (looping) {
            message.channel.send("Choose roles to be given to users when they join the server!");
            const optionChosen = await promptOptions(message.channel, message.author, "Here are your options:",[
                "Add a role",
                "Remove a role",
                "Finish"
            ]).catch(() => {
                fellAsleep(message.channel, message.author);
                looping = false;
            });

            if (optionChosen === 0) {
                await createRole(message.channel, message.author, message.guild.id)
                    .catch(() => {
                        asleepWarning(message.channel, message.author);
                    });
            } else if (optionChosen === 1) {
                const roleToDelete = await promptRole(message.channel, message.author, message.guild.id);

                roleToDelete.destroy()
                    .catch(() => {
                        asleepWarning(message.channel, message.author);
                    });

                message.channel.send("The role was deleted.");

            } else if (optionChosen === 2) {
                message.channel.send("Finished setting up auto roles!");
                looping = false;
            }
        }
    }
};
