const { MessageEmbed } = new require("discord.js");

const max_number_of_definitions = 2;

module.exports = {
    name: ['reminder', 'remind'],
    description: "Remind you about something. Usage: <time> <message>",
    execute (message, args) {
        const timeString = args[0];

        const timeRegex = /\d+d\d+h\d+m\d+s/;

        const match = timeString.match(timeRegex);

        message.channel.send(JSON.stringify(match));
    }
}
