let funnyReplies = ["101 0011 0001 1000 0000 0000 1000", "Guess they should've followed the rules.", "Ouch! That hurt.", "You wont be missed!", "Farewell, traveler.", "You will be forever missed!", "Adiós fuckboy.", "I never really liked that guy."]


module.exports = {
    name: 'kick',
    description: 'Kicks a user from the guild.',
    execute(message, args){

        if(!message.guild.member(message.author).hasPermission(['KICK_MEMBERS'])){

            return message.channel.send("Insufficient permissions.");
        }
        
        else {

            let kickUser = message.mentions.users.first();
            let kickReasons = args.slice(1)
            let kickReason = kickReasons.join(" ")

            if(!kickUser){
                return message.channel.send(`Incorrect usage. Proper usage, _kick {user}, reason`)
            }

            var funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
            const { MessageEmbed } = require("discord.js");
            var embed = new MessageEmbed()

                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(`The moderators have spoken, ${kickUser.tag} has been kicked from ${message.guild.name}! ` + funnyReply)
                .addField("Ban reason", kickReason)
                .addField("Moderator", message.author.tag)  
                .setColor("ORANGE")
            
            message.channel.send(embed)
            message.channel.send(kickReason)
            message.guild.member(kickUser).kick({ reason: kickReason})
                .then(console.log)
                .catch(console.error);
            
        }
    }
}