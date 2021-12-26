const { MessageEmbed } = new require("discord.js");

const max_number_of_definitions = 2;

module.exports = {
    name: ['reminder', 'remind'],
    description: "Remind you about something. Usage: <time> <message>",
    execute (message, args) {
        const timeString = args[0];
    }
}
