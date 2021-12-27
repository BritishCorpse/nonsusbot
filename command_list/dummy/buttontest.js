const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
    name: 'buttontest',
    description: "test buttons",
    developer: true,
    execute (message, args) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle('PRIMARY')
            );

        message.channel.send({content: 'test', components: [row]});
    }
}
