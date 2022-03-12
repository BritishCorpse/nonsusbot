const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "userinfo",
    description: "See information about a specified user.",
    userPermissions: ["MODERATE_MEMBERS"], // not really a needed permission but it's for making it available only to high ups

    usage: [
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        
        const user = message.mentions.users.first() || message.member.user;

        const userInDb = await Users.findOne({ where: { user_id: user.id}});

        const target = await message.guild.members.fetch(user.id);
        if (!target) {
            message.channel.send("You did not specify a user.");
            return;
        }

        if (target.bot) {
            message.channel.send("Shh, bots are private!");
            return;
        }

        else {
            const embed = new MessageEmbed()
                .setTitle(`Userinfo about ${target.user.tag}`)
                .setColor(randomColor)
                .addField(`${user.username}'s badge is:`, `${userInDb.badge || "User does not have a badge."}`)
                .addField(`${user.username}'s balance is:`, `${userInDb.balance}<:ripcoin:929759319296192543>`)
                .addField(`${user.username} joined at:`, ` ${new Date(target.joinedTimestamp)}`, true)
                .addField(`${user.username}'s account was created at:`, ` ${new Date(target.user.createdTimestamp)}`, true)
                .addField(`${user.username}'s nickname is:`, ` ${target.nickname || "None"}`, true)
                .addField(`${user.username}'s presence is:`, ` ${target.presence || "No presence"}`, true)
                .addField(`${user.username}'s role amount is:`, `${target.roles.cache.size - 1}`, true)
                .addField(`Is ${user.username} bannable:`, `${target.bannable}`, true)
                .addField(`Is ${user.username} kickable:`, `${target.kickable}`, true)
                .addField(`Is ${user.username} moderatable: `, `${target.moderatable}`, true)
                .addField("This was sent in:", `${target.guild}`, true)
                .addField(`${user.username}'s display colour is:`, `${target.displayColor}`, true)
                .addField(`${user.username}'s display colour in hexadecimal code is:`, `${target.displayHexColor}`, true)
                .addField(`${user.username}'s id is:`, `${target.id}`, true)
                .setImage(target.displayAvatarURL({ format: "png"}));
                
            message.channel.send({embeds: [embed]});
        }

    }
};
