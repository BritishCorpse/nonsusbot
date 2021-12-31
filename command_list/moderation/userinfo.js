const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'userinfo',
    description: 'See information about a specified user.',
    userPermissions: ["MODERATE_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    execute(message, args) {
        let user = message.mentions.users.first() || message.member.user
        const target = message.guild.members.cache.get(user.id)
        if(!target) {
            message.channel.send("You did not specify a user.");
            return;
        }

        else {
            const embed = new MessageEmbed()
            .setTitle(`Userinfo about ${target}`)
            .setColor("ORANGE")
            .addField(`${user.username} joined at:`, ` ${new Date(target.joinedTimestamp)}`, inline=true)
            .addField(`${user.username}'s account was created at:`, ` ${new Date(target.createdTimestamp)}`, inline=true)
            .addField(`${user.username}'s nickname is:`, ` ${target.nickname || 'None'}`, inline=true)
            .addField(`${user.username}'s presence is:`, ` ${target.presence || 'No presence'}`, inline=true)
            .addField(`${user.username}'s role amount is:`, `${target.roles.cache.size - 1}`, inline=true)
            .addField(`Is ${user.username} bannable:`, `${target.bannable}`, inline=true)
            .addField(`Is ${user.username} kickable:`, `${target.kickable}`, inline=true)
            .addField(`Is ${user.username} moderatable: `, `${target.moderatable}`, inline=true)
            .addField(`This was sent in:`, `${target.guild}`, inline=true)
            .addField(`${user.username}'s display colour is:`, `${target.displayColor}`, inline=true)
            .addField(`${user.username}'s display colour in hexadecimal code is:`, `${target.displayHexColor}`, inline=true)
            .addField(`${user.username}'s id is:`, `${target.id}`, inline=true)
            .setImage(target.displayAvatarURL({ format: 'png'}))
    
            message.channel.send({embeds: [embed]});
        }

    }
}
