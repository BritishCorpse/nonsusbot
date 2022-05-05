const { UserKarma, Users } = require(`${__basedir}/db_objects`);

const { userMention } = require("@discordjs/builders");

module.exports = {
    name: ["karma"],
    description: "Shows your or someone else's karma.",

    /* Checking if the user mentioned someone, if they did it will use that user, if not it will use
    the author. */
    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],

    async execute(message) {
        /* Checking if the user mentioned someone, if they did it will use that user, if not it will
        use the author. */
        const user = message.mentions.users.first() || message.author;

        //Find the target in the database.
        const userBadge = await Users.findOne({
            where: {user_id: user.id}
        }) || null; // this makes it an empty object if it is null

        /* Checking if the user is in the database. */
        const userInDb = await UserKarma.findOne({
            where: {
                user_id: user.id
            }
        }) || null;

        if (userInDb === null) return message.channel.send("This user was not found.");

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        //their rank if they have one   
        let userRank;
        if (userBadge.rank) {
            userRank = userBadge.rank;
        }

        /* Creating an embed. */
        const embed = {
            description: `${userBadge.badge || ""}${userMention(user.id)}'s karma`,

            author: {
                name: "Fortune Teller",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            /* Creating a field in the embed. */
            fields: [
                {
                    name: "Karma",
                    value: `${await userInDb.karma}`
                },

                {
                    name: "Rank",
                    value: `${userRank || "None"}`
                }
            ],

            color: "33a5ff",

            timestamp: new Date(),
    
            footer: {
                text: "Powered by Graveyard",
            },
        };

        /* Sending the embed to the channel. */
        message.channel.send({ embeds: [embed], allowedMentions: {repliedUser: true} });
    }       

};
