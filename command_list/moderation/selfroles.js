const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
//const { circularUsageOption } = require(`${__basedir}/functions`);


async function promptOptions(channel, user, promptMessage, options) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("dropdown")
                .addOptions(options.map((option, i) => {
                    return {label: `${i + 1}. ${option}`, value: i.toString()};
                }))
        );

    const message = await channel.send({
        content: promptMessage,
        components: [row]
    });

    const filter = interaction => interaction.user.id === user.id;
    // max time for collector
    const collector = message.createMessageComponentCollector({filter, time: 2_147_483_647});

    collector.on("end", () => {
        row.components[0].setDisabled(true);
        message.edit({components: [row]});
    });

    return new Promise((resolve) => {
        collector.on("collect", interaction => {
            row.components[0].options[Number.parseInt(interaction.values[0])].default = true;
            interaction.update({components: [row]});
            collector.stop();
            resolve(Number.parseInt(interaction.values[0]));
        });
    });
}


function mainOptions(channel, user) {
    return promptOptions(channel, user, "Here are your options:",[
        "Add a category",
        "Edit a category",
        "Choose the channel",
        "Finish"
    ]);
}


async function createCategory(channel, user) {
    // create a new category of self roles
    
    await channel.send("Enter the name of the category:");
    
    const filter = message => message.author.id === user.id;
    const messages = await channel.awaitMessages({filter, time: 2_147_483_647, max: 1, errors: ["time"]});
    const categoryName = messages.first().content;

    channel.send(`The name of the cateogry is ${categoryName}`);

    while (true) {
        const optionChosen = await promptOptions(message.channel, message.author,
            `Edit the category ${categoryName}`, [
                "Add role",
                "Remove role",
                "Finish"
            ]);

        if (optionChosen === 0) {
        } else if (optionChosen === 1) {
        } else if (optionChosen === 2) {
            message.channel.send("Finished creating the category");
            break;
        }
    }

}


async function promptChannel(channel, user) {
    // ask for the channel where the self roles should be
    const filter = message => message.author.id === user.id;
    const messages = await channel.awaitMessages({filter, time: 2_147_483_647, max: 1, errors: ["time"]});
    const channelName = messages.first().content;
    channel.send(`The channel is ${channelName}`);
}


module.exports = {
    name: "selfroles",
    description: "Manage self roles",
    userPermissions: [],

    usage: [
        { tag: "setup", checks: {is: "setup"} }
    ],

    async execute(message, args) {
        //const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        //const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        if (args[0] === "setup") {
            message.channel.send("You are setting up self roles!");

            while (true) {
                const optionChosen = await mainOptions(message.channel, message.author);

                if (optionChosen === 0) {
                    await createCategory(message.channel, message.author);
                } else if (optionChosen === 1) {

                } else if (optionChosen === 2) {

                } else if (optionChosen === 3) {
                    message.channel.send("Finished setting up self roles!");
                    break;
                }
            }
        }
    }
};
