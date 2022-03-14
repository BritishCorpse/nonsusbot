const { MessageEmbed } = require("discord.js");
const { circularUsageOption } = require(`${__basedir}/functions`);


const funnyReplies = [
    "101 0011 0001 1000 0000 0000 1000",
    "Guess they should've followed the rules.",
    "Ouch! That hurt.", "You wont be missed!",
    "Farewell, traveler.",
    "You will be forever missed!",
    //"Adiós fuckboy.",
    "I never really liked that guy."
];


module.exports = {
    name: "permban",
    description: "Permanently bans a user from the guild.",
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                circularUsageOption(
                    { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                )
            ]
        }
    ],

    execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const banUser = message.mentions.members.first();
        const banReason = args.slice(1).join(" ");

        if (!banUser || !banReason) {
            return message.channel.send(`Incorrect usage. Proper usage: ${prefix}permban {user} reason`);
        }

        const funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
        const embed = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL()})
            .setDescription(`The moderators have spoken, the ban hammer has fallen, ${banUser.user.tag} has been banned from ${message.guild.name}! ` + funnyReply)
            .addField("Ban duration", "Permanent")
            .addField("Ban reason", banReason)
            .addField("Moderator", message.author.tag)
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
        banUser.ban({reason: banReason})
            .catch(console.error);
    }
};
