let funnyReplies = ["101 0011 0001 1000 0000 0000 1000", "Guess they should've followed the rules.", "Ouch! That hurt.", "You wont be missed!", "Farewell, traveler.", "You will be forever missed!", "Adiós fuckboy.", "I never really liked that guy."]
let prefix = "_"

module.exports = {
    name: 'permban',
    description: "Ban's a user from the guild permanently.",
    execute (message, args) {

        if(!message.guild.member(message.author).hasPermission(['BAN_MEMBERS'])){
            return message.channel.send("Insufficient permissions.");
        }

        else {
            let banUser = message.mentions.users.first();
            let banReasons = args.slice(1)
            let banReason = banReasons.join(" ")

            if(!banUser || !banReason){
                return message.channel.send(`Incorrect usage. Proper usage, ${prefix}permban {user}, reason`);
            }

            var funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
            const { MessageEmbed } = require("discord.js");
            var embed = new MessageEmbed()

                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(`The moderators have spoken, the ban hammer has fallen, ${banUser.tag} has been banned from ${message.guild.name}! ` + funnyReply)
                .addField("Ban duration", "Permanent")
                .addField("Ban reason", banReason)
                .addField("Moderator", message.author.tag)
                .setColor("ORANGE")

            message.channel.send(embed)
            message.guild.member(banUser).ban({reason: banReason})
                .then(console.log)
                .catch(console.error);

            
        }
    }
}