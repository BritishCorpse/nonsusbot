const { MessageEmbed } = require("discord.js");
const { createInfiniteCircularUsage } = require(`${__basedir}/functions`);


const funnyReplies = [
    "101 0011 0001 1000 0000 0000 1000",
    "Guess they should've followed the rules.",
    "Ouch! That hurt.",
    "You wont be missed!",
    "Farewell, traveler.",
    "You will be forever missed!",
    "Adiós fuckboy.",
    "I never really liked that guy."
];


module.exports = {
    name: 'kick',
    description: 'Kicks a user from the guild.',
    userPermissions: ["KICK_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: createInfiniteCircularUsage([
                { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"\(\)\/]/}, isempty: {not: null}} }
            ])
        }
    ],

    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const kickUser = message.mentions.members.first();
        const kickReason = args.slice(1).join(" ");

        if (!kickUser) {
            return message.channel.send(`Incorrect usage. Proper usage, ${prefix}kick ${user} reason`);
        }

        const funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setDescription(`The moderators have spoken, ${kickUser.tag} has been kicked from ${message.guild.name}! ` + funnyReply)
            .addField("Ban reason", kickReason)
            .addField("Moderator", message.author.tag)  
            .setColor("ORANGE");

        message.channel.send({embeds: [embed]});
            kickUser.kick({reason: kickReason})
            .then(console.log)
            .catch(console.error);
    }
}
