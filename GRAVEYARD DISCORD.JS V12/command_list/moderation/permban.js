const { Permissions } = require("discord.js");

module.exports = {
    name: ["permban"],
    description: "Permanently bans a member from the guild.",
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],

    usage: [],

    async execute (message, args) {

        //Define who to ban, and the reason for the ban.
        const target = message.mentions.members.first();
        let reason = args[1];

        //Check if there's a target.
        if (!target) return message.channel.send("You did not specify a target.");

        //Check if the reason exists.
        if (!reason) {
            reason = "No reason provided";
        }

        //Check if the user is lower in the role list.
        if (message.member.roles.highest.position < target.roles.highest.position) {
            message.channel.send("You are not able to timeout this member.");
            return;
        }

        //Check if the bot is able to timeout the target.
        if (message.guild.me.roles.highest.position < target.roles.highest.position || target.permissions.has(Permissions.FLAGS.ADMINISTRATOR || message.guild.ownerId === target.id)) {
            message.channel.send("I am not able to timeout this member.");
            return;
        }

        //Ban the target using the predetermined values.
        target.ban({ days: 0, reason: reason });

        //Fancy embed to show to the user
        const embed = {
            color: "#ff8800",
    
            title: "A user was banned.",
    
            author: {
                name: "Logger.",
                icon_url: message.client.user.displayAvatarURL(),
                url: "https://talloween.github.io/graveyardbot/",
            },
    
            fields: [
                {
                    name: "Banned user",
                    value: `${target.user}`
                },
                {
                    name: "Duration",
                    value: "Permanent"
                },
                {
                    name: "Reason",
                    value: `${reason}`
                }
            ],

            timestamp: new Date(),
            
            thumbnail: `${target.user.displayAvatarURL()}`,

            footer: {
                text: "Powered by Graveyard",
            },
        };

        //send the fancy embed.
        message.channel.send({ embeds: [embed]});
    }
};
