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
        const user = message.mentions.users.first() || message.author;

        //Find the target in the database.
        const userInDb = await Users.findOne({
            where: {user_id: user.id}
        }) || null; // this makes it an empty object if it is null

        //Crashes with bots so this is acheck to see if the user running is a bot.
        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        if (userInDb === null) {
            message.channel.send("This user was not found.");
            return;
        }

        // this is just how many coins the user has
        const userBalance = userInDb.balance;

        // cool badge to show next to the user if they have one
        let userBadge;
        if (userInDb.badge) {
            userBadge = userInDb.badge;
        }

        //their rank if they have one   
        let userRank;
        if (userInDb.rank) {
            userRank = userInDb.rank;
        }

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

        message.channel.send({ embeds: [embed], allowedMentions: {repliedUser: true} });
    }       

};
