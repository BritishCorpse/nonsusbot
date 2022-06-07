const { Permissions } = require("discord.js");

module.exports = {
    name: ["tempban"],
    description: "Temporarily bans a user from the guild, for a determined amount of days.",
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],

    usage: [],

    async execute (message, args) {

        //Define who to ban, how long it should last, and the reason for the ban.
        const target = message.mentions.members.first();
        let duration = args[1];
        let reason = args[2];

        //Check if there's a target.
        if (!target) return message.channel.send("You did not specify a target.");

        //Check if theres a duration.
        if (!duration) {
            message.channel.send("No time was provided, defaulting to 7 days.");

            //This is the default duration.
            duration = 7;
        }   

        //Check if they entered a number higher than 7 or something that's not a number.
        if (duration > 7 || isNaN(duration)) {
            message.channel.send("Invalid number of days. Please specify a number between 0-7.");
            return;
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

        //Ban the target using the predetermined values.
        target.ban({ days: duration, reason: reason });

        //Fancy embed to show to the user
        const embed = {
            color: "RED",
    
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
                    value: `${duration}d`
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

        //Check if the log channel exists.
        let logChannel;

        if (message.client.serverConfig.get(message.guild.id).log_channel_id) {
            logChannel = await message.client.channels.fetch(message.client.serverConfig.get(message.guild.id).log_channel_id);
        }  

        if (logChannel === undefined) return;

        logChannel.send({embeds: [embed]});
    }
};
