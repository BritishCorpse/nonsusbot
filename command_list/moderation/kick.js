const { MessageEmbed } = require("discord.js");
const { circularUsageOption } = require(`${__basedir}/functions`);


const funnyReplies = [
    "101 0011 0001 1000 0000 0000 1000",
    "Guess they should've followed the rules.",
    "Ouch! That hurt.",
    "You wont be missed!",
    "Farewell, traveler.",
    "You will be forever missed!",
    //"Adiós fuckboy.",
    "I never really liked that guy."
];


module.exports = {
    name: ["kick"],
    description: "Kicks a user from the guild.",
    botPermissions: ["KICK_MEMBERS"],
    userPermissions: ["KICK_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                circularUsageOption(
                    { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                )
            ]
        }
    ],

    async execute(message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const kickUser = message.mentions.members.first();
        const kickReason = args.slice(1).join(" ");

        if (!kickUser) {
            return message.channel.send(`Incorrect usage. Proper usage, ${prefix}kick ${kickUser} reason`);
        }

        const funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
        const embed = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL()})
            .setDescription(`The moderators have spoken, ${kickUser.user.tag} has been kicked from ${message.guild.name}! ` + funnyReply)
            .addField("Kick reason", kickReason)
            .addField("Moderator", message.author.tag)  
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
        kickUser.kick({reason: kickReason})
            .catch(console.error);
    }
};
