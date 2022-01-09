const { MessageActionRow, MessageButton } = require("discord.js");


module.exports = {
    name: "buttontest",
    description: "test buttons",
    developer: true,

    usage: [
    ],

    execute (message) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel("Primary")
                    .setStyle("DANGER")
            );

        message.channel.send({content: "test", components: [row]})
            .then(botMessage => {
                const collector = botMessage.createMessageComponentCollector({componentType: "BUTTON", time: 30000});

                collector.on("collect", interaction => {
                    interaction.deferUpdate();
                    console.log(interaction);
                });

                collector.on("end", () => {
                    message.channel.send("timed out");

                    for (const button of row.components) {
                        button.setDisabled(true);
                    }
                    botMessage.edit({components: [row]});

                    console.log(row);
                });
            });
    }
};
