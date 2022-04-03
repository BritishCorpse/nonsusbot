const { Permissions } = require('discord.js');

module.exports = {
    name: ["timeout", "to"],
    description: "Sets a user in timeout. Enter the time in hours.",
    botPermissions: ["MODERATE_MEMBERS"],
    userPermissions: ["MODERATE_MEMBERS"],

    usage: [ // This should probably be filled with something useful that could actually be understood and work :smile:
    ],

    async execute (message, args) {

        //Define who to timeout, how long it should last, and the reason for the timeout.
        const target = message.mentions.members.first();
        let duration = args[1];
        let reason = args[2];

        //Check if there's a target.
        if (!target) return message.channel.send("You did not specify a target.");

        //Check if theres a duration
        if (!duration) {
            message.channel.send("No time was provided, defaulting to 1 hour.");

            //This is the default duration
            duration = 1;
        }   

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

        //Timeout the target
        target.timeout(duration * 60 * 1000, reason);

        //Fancy embed to show to the user
        const embed = {
            color: "RED",
    
            title: "A user was timed out.",
    
            author: {
                name: "Logger.",
                icon_url: message.client.user.displayAvatarURL(),
                url: "https://talloween.github.io/graveyardbot/",
            },
    
            fields: [
                {
                    name: "Timed out user",
                    value: `${target.user}`
                },
                {
                    name: "Duration",
                    value: `${duration}h`
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
