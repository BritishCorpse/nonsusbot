const { MessageEmbed } = require("discord.js");
const { circularUsageOption } = require(`${__basedir}/functions`);


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
    name: "tempban",
    description: "Temporarily bans a user from the guild, for a determined amount of days.",
    userPermissions: ["BAN_MEMBERS"],

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                { tag: "time", checks: {ispositiveinteger: null},
                    next: [
                        circularUsageOption(
                            { tag: "reason", checks: {matches: {not: /[^\w?!.,;:'"()/]/}, isempty: {not: null}} }
                        )
                    ]
                }
            ]
        }
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const banUser = message.mentions.members.first();
        const banTime = args[1];
        const banReason = args.slice(2).join(" ");

        if (!banUser || !banTime) {
            return message.channel.send(`Incorrect usage. Proper usage, ${prefix}tempban ${banUser} time reason`);
        }

        if (banTime > "7") {
            message.channel.send("Ban duration is too long.");
            return;
        }
        if (!banReason) {
            return message.channel.send("No ban reason specified.");
        }

        const funnyReply = funnyReplies[Math.floor(Math.random()*funnyReplies.length)];
        const embed = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.avatarURL()})
            .setDescription(`The moderators have spoken, the ban hammer has fallen, ${banUser.user.tag} has been banned from ${message.guild.name}! ` + funnyReply)
            .addField("Ban duration", banTime)
            .addField("Ban reason", banReason)
            .addField("Moderator", message.author.tag)
            .setColor(randomColor);

    
        const embed2 = new  MessageEmbed()
            .setTitle(`You have been banned from ${message.guild.name}!`)
            .setColor(randomColor)
            .setDescription(`Reason: ${banReason}`);

        await banUser.send({embeds: [embed2]});

        message.channel.send({embeds: [embed]});

        banUser.ban({days: banTime, reason: banReason})
            .catch(console.error);
        
    }
};
