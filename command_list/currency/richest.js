const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);
const { gravestone } = require(`${__basedir}emojis.json`);

module.exports = {
    name: ["richest", "rich"],
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        function defineUser(userId) {
            return Users.findOne({ where: {user_id: userId} });
        }

        const embed = new MessageEmbed()
            .setTitle("Top 10 richest people anywhere!")
            .setColor(randomColor);

        const topTen = message.client.currency.sort((a, b) => b.balance - a.balance)
            //.filter(user => message.client.users.(user.user_id))
            .filter(user => user.user_id !== "1") // filter out the casino user
            .first(10);

        if (topTen.length === 0) {
            embed.setDescription("No users were found in the database.");
        } else {
            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, user, position) => {
                await memo; // Waits for previous to end.
                const userInDb = await defineUser(user.user_id);
                const userInDiscord = await message.client.users.fetch(user.user_id);
                embed.addField(`${position + 1}. ${userInDb.badge || ""}${userInDiscord.tag}`, `${user.balance}${gravestone}`);
            }, undefined);
        }

        message.channel.send({ embeds: [embed] });
    }
};
