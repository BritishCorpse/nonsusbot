const { Levels, Users } = require(`${__basedir}/db_objects`);

const { userMention } = require("@discordjs/builders");

module.exports = {
    name: ["level"],
    usage: [],
    description: "See your or someone else's level.",
    async execute(message) {
        const user = message.mentions.users.first() || message.author;

        if(user.bot) {
            message.channel.send("Bots cannot be ranked!");
            return;
        }

        const userInDb = await Levels.findOne({
            where: {userId: user.id, guildId: message.guild.id}
        }) || null; // this makes it an empty object if it is null
        
        //Find the user in the db.
        const userInDbTwo = await Users.findOne({
            where: { user_id: user.id }
        }) || null;


        // cool badge to show next to the user if they have one
        let userBadge;
        if (userInDbTwo.badge) {
            userBadge = userInDbTwo.badge;
        }

        //their rank if they have one   
        let userRank;
        if (userInDbTwo.rank) {
            userRank = userInDbTwo.rank;
        }

        const embed = {
            description: `${userBadge || ""}${userMention(user.id)}'s level`,

            author: {
                name: "EXP Merchant",
                icon_url: `${message.client.user.avatarURL()}`,
                url: "https://talloween.github.io/graveyardbot/",
            },

            fields: [
                {
                    name: "Level",
                    value: `${userInDb.level}`
                },

                {
                    name: "EXP",
                    value: `${userInDb.exp}/${userInDb.reqExp}`
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

        message.channel.send({ embeds: [embed] });

    }       
};
