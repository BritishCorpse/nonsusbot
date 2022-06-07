const { Levels, Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["leaderboard", "lb"],
    description: "Shows the users with the highest levels.",

    usage: [
    ],

    async execute(message) {
        function defineUser(userId) {
            return Levels.findOne({ where: {userId: userId, guildId: message.guild.id}  });
        }
    
        let levels = await Levels.findAll({ where: {guildId: message.guild.id} });
        levels = levels.filter(l => l.userId !== "1"); // filter out the casino user
        levels.sort((a, b) => a.level === b.level ? b.exp - a.exp : b.level - a.level);

        const topTen = levels.slice(0, 10);

        if (topTen.length === 0) {
            return message.channel.send("No user's were found in the database.");
        } else {

            const embed = {
                author: {
                    name: "EXP Merchant",
                    icon_url: `${message.client.user.avatarURL()}`,
                    url: "https://talloween.github.io/graveyardbot/",
                },

                title: "The Top 10 Highest Level Members.",
                
                fields: [
                    
                ],

                color: "33a5ff",
                
                timestamp: new Date(),
        
                footer: {
                    text: "Powered by Graveyard",
                },
            };

            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, userLevel, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(userLevel.userId);
                const userInDiscord = await message.client.users.fetch(userLevel.userId);
                const userUser = await Users.findOne({ where: {user_id: userInDiscord.id} });

                // cool badge to show next to the user if they have one
                let userBadge;
                if (userUser.badge) {
                    userBadge = userUser.badge;
                }

                embed.fields.push({
                    name: `${position + 1 /*offsets the position by one*/}. ${userBadge || ""}${userInDiscord.username}`,
                    value: `Level: ${userInDb.level} EXP: ${userInDb.exp}/${userInDb.reqExp}`
                });

            }, undefined);

            message.channel.send({embeds: [embed] });
        }


    }
};
