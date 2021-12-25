const { MessageEmbed } = require("discord.js");


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
    name: 'tempban',
    category: "Moderation",
    description: "Temporarily bans a user from the guild, for a determined amount of days.",
    execute (message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        if (!message.member.permissionsIn(message.channel).has('BAN_MEMBERS')) {
            return message.channel.send("Insufficient permissions.");
        } 
        
        else {
            let banUser = message.mentions.members.first();
            const banTime = args[1];
            const banReason = args.slice(2).join(" ");

            if (!banUser || !banTime) {
                return message.channel.send(`Incorrect usage. Proper usage, ${prefix}tempban ${banUser} time reason`);
            }

            if (!banReason) {
                return message.channel.send("No ban reason specified.");
            }

            const funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(`The moderators have spoken, the ban hammer has fallen, ${banUser.tag} has been banned from ${message.guild.name}! ` + funnyReply)
                .addField("Ban duration", banTime)
                .addField("Ban reason", banReason)
                .addField("Moderator", message.author.tag)
                .setColor("ORANGE");

            message.channel.send({embeds: [embed]});
                banUser.ban({days: banTime, reason: banReason})
                .then(console.log)
                .catch(console.error);
        }
    }
}
