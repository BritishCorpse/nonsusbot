module.exports = {
    name: 'usagetest',
    description: "test usage checking",
    developer: true,
    usage: [    // used both for documentation in help and for actually checking the usage of a command before running it
        {
            tag: "firstarg" // the <tag> it shows in the help command, for example _config <set> <channelid>
            example: "firstarg", // optional, for more help ?
            check: { // the test(s) the argument must pass to be valid; also the info the help command will show for each argument
                is: "firstarg",             // checks if argument is exactly this
                // isinteger: true,         // checks if argument is a number
                // matches: /regex/,        // checks if argument matches the regex
                // custom: (arg) => {}      // custom function for more complex logic if needed, but shouldn't be needed
            },
            next: [       // next argument when first arg passes the test
                {
                    
                },
                {
                    
                },
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
