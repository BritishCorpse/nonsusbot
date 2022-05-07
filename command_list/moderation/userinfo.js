const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["userinfo"],
    description: "See information about a specified user.",
    userPermissions: ["MODERATE_MEMBERS"], // not really a needed permission but it's for making it available only to high ups

    usage: [
        { tag: "user", checks: {isuseridinguild: null} }
    ],

    async execute(message) {        
        const userInDiscord = message.mentions.users.first() || message.member.user;
        const userInGuild = message.mentions.members.first() || message.member;
        const userInDb = await Users.findOne({ where: { user_id: userInDiscord.id}});

        //Fixes an error where it doesnt find the badge for bots.
        if (userInDiscord.bot) return message.channel.send("Bot's cannot be viewed!");

        const embed = {
            color: "33a5ff",

            title: "User information",

            url: "https://talloween.github.io/graveyardbot/",

            author: {
                name: "Moderation assistant",
                icon_url: message.client.user.avatarURL(),
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [],

            footer: {
                text: "Powered by graveyard",
            },

            timestamp: new Date(),
        };

        const userObject = {
            "Badge": userInDb.badge,

            "Username": userInDiscord.username,

            "Account created on": new Date(userInDiscord.createdAt.toUTCString()),

            "Joined this guild on": new Date(userInGuild.joinedAt.toUTCString()),

            "Nickname": userInGuild.nickname || "No nickname",

            "Custom status": userInDiscord.presence || "No presence",

            "Bannable": userInGuild.bannable,

            "Kickable": userInGuild.kickable,

            "Moderatable": userInGuild.moderatable,

            "Display colour": userInGuild.displayColor,

            "Display colour in hex code": userInGuild.displayHexColor,

            "User ID": userInDiscord.id
        };

        for (const key in userObject) {
            embed.fields.push({
                name: `${key}`,
                value: `${userObject[key]}`,
                inline: true,
            });
        }

        return message.channel.send({ embeds: [embed] });
    }
};
