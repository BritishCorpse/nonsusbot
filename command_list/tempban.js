let funnyReplies = ["101 0011 0001 1000 0000 0000 1000", "Guess they should've followed the rules.", "Ouch! That hurt.", "You wont be missed!", "Farewell, traveler.", "You will be forever missed!", "Adiós fuckboy.", "I never really liked that guy."]
let prefix = "_"

module.exports = {
    name: 'tempban',
    description: "Ban's a user from the guild.",
    execute (message, args) {

        if(!message.guild.member(message.author).hasPermission(['BAN_MEMBERS'])){
            return message.channel.send("Insufficient permissions.");
        }

        else {
            let banUser = message.mentions.users.first();
            let banTime = args[1];
            let banReasons = args.slice(2)
            let banReason = banReasons.join(" ")

            if(!banUser || !banTime){
                return message.channel.send(`Incorrect usage. Proper usage, ${prefix}ban {user}, time, reason`);
            }

            if(!banReason){
                return message.channel.send("No ban reason specified.");
            }

            var funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
            const { MessageEmbed } = require("discord.js");
            var embed = new MessageEmbed()

                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(`The moderators have spoken, the ban hammer has fallen, ${banUser.tag} has been banned from ${message.guild.name}! ` + funnyReply)
                .addField("Ban duration", banTime)
                .addField("Ban reason", banReason)
                .addField("Moderator", message.author.tag)
                .setColor("ORANGE")

            message.channel.send(embed)
            message.guild.member(banUser).ban({ days: banTime, reason: banReason})
                .then(console.log)
                .catch(console.error);

            
        }
    }
}