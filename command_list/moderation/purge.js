const { MessageEmbed } = require("discord.js");


module.exports = {
    name: 'purge',
    description: 'Deletes a specified amount of messages.',
    userPermissions: ["MANAGE_MESSAGES"],
    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const numberOfMessages = Number.parseInt(args[0]);

        if (numberOfMessages.toString() !== args[0] || numberOfMessages.toString() === 'NaN') {
            message.channel.send('Invalid number of messages to delete. Please enter a number').
            return;
        }

        message.delete()
        .then(deletedMessage => {
            deletedMessage.channel.messages.fetch({limit: numberOfMessages})
                .then(messages => deletedMessage.channel.bulkDelete(messages));
            deletedMessage.channel.send(`Deleted ${numberOfMessages} messages.`)
            .then(async botMessage => {
                await setTimeout(() => {
                    botMessage.delete();
                }, 3000);
            });
        });
    }
}
