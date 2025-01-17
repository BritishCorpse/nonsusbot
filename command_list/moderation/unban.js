const { circularUsageOption } = require(`${__basedir}/utilities`);


module.exports = {
    name: ["unban"],
    description: "Unbans a user from the guild using userID.",
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],

    usage: [
        { tag: "user", checks: {isbanneduseridinguild: null},
            next: [
                circularUsageOption(
                    { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                )
            ]
        }
    ],

    async execute(message, args) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        
        const unbanUser = message.mentions.members.first();
        const unbanReasons = args.slice(1);
        const unbanReason = unbanReasons.join(" ");

        message.guild.members.unban(unbanUser);

        const { MessageEmbed } = require("discord.js");
        const embed = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL()})
            .setDescription(`The moderators have spoken, the ban hammer has been lifted, ${unbanUser.user.tag} has been unbanned! ` + "Welcome back soldier.")
            .addField("Unban reason", unbanReason)
            .addField("Moderator", message.author.tag)
            .setColor(randomColor);
        
        message.channel.send({embeds: [embed]});
    }
};
