const { Users } = require(`${__basedir}/db_objects`);

const { userMention } = require("@discordjs/builders");

const { gravestone } = require(`${__basedir}/emojis.json`); 

module.exports = {
    name: ["balance", "bal"],
    description: "Shows your balance, or someone else's balance.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null} },
        { tag: "nothing", checks: {isempty: null} }
    ],

    async execute(message) {
        /* Checking if the user has mentioned someone. If they have, it will set the user variable to the
        mentioned user. If they haven't, it will set the user variable to the author of the message. */
        const user = message.mentions.users.first() || message.author;

        /* Finding the user in the database. */
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || null;

        /* Checking if the user is a bot. If they are, it will send a message saying that bots cannot be
        ranked. */
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        /* Checking if the user is in the database. If they are not, it will send a message saying that the
        user was not found. */
        if (userInDb === null) {
            message.channel.send("This user was not found.");
            return;
        }

        /* Getting the user's balance from the database. */
        const userBalance = userInDb.balance;


        /* Checking if the user has a badge. If they do, it will set the userBadge variable to the user's
        badge. If they don't, it will set it to null. */
        let userBadge;
        if (userInDb.badge) {
            userBadge = userInDb.badge;
        }

        /* Checking if the user has a rank. If they do, it will set the userRank variable to the user's rank.
        If they don't, it will set it to null. */
        let userRank;
        if (userInDb.rank) {
            userRank = userInDb.rank;
        }

        /* Creating an embed. */
        const embed = {
            description: `${userBadge || ""}${userMention(user.id)}'s balance`,

            author: {
                name: "Bank Assistant",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [
                {
                    name: "Bank Balance",
                    value: `${userBalance}${gravestone}`
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
