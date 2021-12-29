module.exports = {
    name: 'usagetest',
    description: "test usage checking",
    developer: true,
    usage: [    // used both for documentation in help and for actually checking the usage of a command before running it
        {
            //is: "string",
            //has: "string",
            //isnumber: "number",
            //
            check: {
                is: "firstarg"
            },
            description: 
            example: 
            next: [       // next arg when first arg passes the test
            ],
        },
    ],

    execute (message, args) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle('DANGER')
            );

        message.channel.send({content: 'test', components: [row]})
        .then(botMessage => {
            const collector = botMessage.createMessageComponentCollector({componentType: 'BUTTON', time: 30000})

            collector.on("collect", interaction => {
                interaction.deferUpdate();
                console.log(interaction);
            });

            collector.on("end", collected => {
                message.channel.send('timed out');

                for (const button of row.components) {
                    button.setDisabled(true);
                }
                botMessage.edit({components: [row]});

                console.log(row);
            });
        });
    }
}
