const { Users } = require(`${__basedir}/db_objects`);

const { gravestone } = require(`${__basedir}/emojis.json`); 

module.exports = {
    name: ["richest", "rich"],
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute(message) {
        function defineUser(userId) {
            return Users.findOne({ where: {user_id: userId} });
        }

        const topTen = message.client.currency.sort((a, b) => b.balance - a.balance)
            //.filter(user => message.client.users.(user.user_id))
            .filter(user => user.user_id !== "1") // filter out the casino user
            .first(10);

        if (topTen.length === 0) {
            return message.channel.send("No user's were found in the database.");
        } else {

            const embed = {
                author: {
                    name: "Bank Assistant",
                    icon_url: `${message.client.user.avatarURL()}`,
                    url: "https://talloween.github.io/graveyardbot/",
                },

                title: "The Top 10 Richest Graveyard Users.",
                
                fields: [
                    
                ],

                color: "33a5ff",
                
                timestamp: new Date(),
        
                footer: {
                    text: "Powered by Graveyard",
                },
            };

            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, user, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(user.user_id);
                const userInDiscord = await message.client.users.fetch(user.user_id);

                // cool badge to show next to the user if they have one
                let userBadge;
                if (userInDb.badge) {
                    userBadge = userInDb.badge;
                }

                embed.fields.push({
                    name: `${position + 1 /*offsets the position by one*/}. ${userBadge || ""}${userInDiscord.username}`,
                    value: `${userInDb.balance}${gravestone}`
                });

                position++;
            }, undefined);  

            message.channel.send({ embeds: [embed] });
        }


    }
};
