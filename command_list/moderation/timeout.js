const { MessageEmbed } = require("discord.js");

function plural(number) {
    return number !== 1 ? "s" : "";
}

const funnyReplies = [
    "101 0011 0001 1000 0000 0000 1000",
    "Guess they should've followed the rules.",
    "Ouch! That hurt.", "You wont be missed!",
    "Farewell, traveler.",
    "You will be forever missed!",
    "Adiós fuckboy.",
    "I never really liked that guy."
];

module.exports = {
    name: ["timeout", "to"],
    description: "Sets a user in timeout.",

    usage: [ // This should probably be filled with something useful that could actually be understood and work :smile:
    ],

    execute (message, args) {
        // Random colour for the embed.
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        // Target who will be timeouted.
        const target = message.mentions.members.first();

        if (!target) {
            message.channel.send("You did not specify a target.");
            return;
        }

        // Time stuff
        const timeString = args[1];

        const timeRegex = /(?:0*(\d+)d)?(?:0*((?:\d)|(?:1\d)|(?:2[0-3]))h)?(?:0*((?:\d)|(?:[1-5]\d))m)?(?:0*((?:\d)|(?:[1-5]\d))s)?/;

        // Make sure that there is a reason to timeout them.
        const reason = args.slice(2).join(" ");

        // More time stuff.
        const match = timeString.match(timeRegex);

        if (match[0] !== timeString) {
            message.channel.send("Invalid time. Format: 0d0h0m0s. Hours can be between 0 and 23, minutes and seconds between 0 and 60.");
            return;
        }

        const days = Number.parseInt(match[1]) || 0;
        const hours = Number.parseInt(match[2]) || 0;
        const minutes = Number.parseInt(match[3]) || 0;
        const seconds = Number.parseInt(match[4]) || 0;

        let string = "";
        if (days > 0)
            string += `${days} day${plural(days)}`;
        if (hours > 0)
            string += `${hours} hour${plural(hours)}`;
        if (minutes > 0)
            string += `${minutes} minute${plural(minutes)}`;
        if (seconds > 0)
            string += `${seconds} second${plural(seconds)}`;
            

        target.timeout(seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000 + days * 24 * 60 * 60 * 1000, reason);

        const funnyReply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
        const embed = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL()})
            .setDescription(`The moderators have spoken, the timeout hammer has fallen, ${target.user.tag} has been timed out in ${message.guild.name}! ` + funnyReply)
            .addField("Timeout duration:", `${string}`)
            .addField("Timeout reason:", `${reason || "No reason provided."}`)
            .addField("Moderator", `${message.author.tag}`)
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
    }
};
