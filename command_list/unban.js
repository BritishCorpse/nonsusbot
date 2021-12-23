module.exports = {
    name: 'unban',
    category: "Moderation",
    description: 'Unbans a user from the guild using userID.',
    execute(message, args){
        if(!message.guild.member(message.author).hasPermission(['BAN_MEMBERS'])){
            return message.channel.send("Insufficient permissions.");
        }

        else {
            let unbanUser = args[0];
            let unbanReasons = args.slice(1)
            let unbanReason = unbanReasons.join(" ")

            message.guild.members.unban(unbanUser);

            const { MessageEmbed } = require("discord.js");
            var embed = new MessageEmbed()

                .setAuthor(`${message.author.username}`, message.author.avatarURL())
                .setDescription(`The moderators have spoken, the ban hammer has been lifted, ${unbanUser.tag} has been unbanned! ` + "Welcome back soldier.")
                .addField("Unban reason", unbanReason)
                .addField("Moderator", message.author.tag)
                .setColor("ORANGE")
            
            message.channel.send(embed)
        }
    }
}
