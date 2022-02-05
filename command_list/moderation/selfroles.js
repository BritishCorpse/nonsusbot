const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
//const { circularUsageOption } = require(`${__basedir}/functions`);


async function promptOption(channel, user) {
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("dropdown")
                .addOptions(
                    {label: "1. Add a category", value: "1"},
                    {label: "2. Edit a category", value: "2"},
                    {label: "3. Choose the channel", value: "3"},
                    {label: "4. Finish", value: "4"}
                )
        );
  
    const message = await channel.send({
        content: "Here are your options:",
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
            row.components[0].options[Number.parseInt(interaction.values[0]) - 1].default = true;
            interaction.update({components: [row]});
            collector.stop();
            resolve(Number.parseInt(interaction.values[0]));
        });
    });
}


async function createCategory(channel, user) {
    // create a new category of self roles
    
    await channel.send("Enter the name of the category:");
    
    const filter = message => message.author.id === user.id;
    const messages = await channel.awaitMessages({filter, time: 2_147_483_647, max: 1, errors: ["time"]});
    const categoryName = messages.first().content;
    channel.send(`The name of the cateogry is ${categoryName}`)
}


async function promptChannel(channel) {
    // ask for the channel where the self roles should be
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
                const optionChosen = await promptOption(message.channel, message.author);

                if (optionChosen === 1) {
                    await createCategory(message.channel, message.author);
                } else if (optionChosen === 2) {

                } else if (optionChosen === 3) {

                } else if (optionChosen === 4) {
                    message.channel.send("Finished setting up self roles!");
                    break;
                }
            }
        }
    }
};
