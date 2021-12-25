module.exports = {
    name: 'unban',
    description: 'Unbans a user from the guild using userID.',
    userPermissions: ["BAN_MEMBERS"],
    execute(message, args) {
        let unbanUser = args[0];
        let unbanReasons = args.slice(1);
        let unbanReason = unbanReasons.join(" ");

        message.guild.members.unban(unbanUser);

        const { MessageEmbed } = require("discord.js");
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL())
            .setDescription(`The moderators have spoken, the ban hammer has been lifted, ${unbanUser.tag} has been unbanned! ` + "Welcome back soldier.")
            .addField("Unban reason", unbanReason)
            .addField("Moderator", message.author.tag)
            .setColor("ORANGE");
        
        message.channel.send({embeds: [embed]});
    }
}