const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: ["leaderboard", "lb"],
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        function defineUser(userId) {
            return Users.findOne({ where: {user_id: userId} });
        }

        const embed = new MessageEmbed()
            .setTitle("Top 10 Richest People Anywhere")
            .setColor(randomColor);

        const topTen = message.client.currency.sort((a, b) => b.balance - a.balance)
            .filter(user => message.client.users.cache.has(user.user_id))
            .first(10);

        if (topTen.length === 0) {
            embed.setDescription("According to my statisticas, there is no one on the leaderboard.");
        } else {
            // Sequential asynchronous loop from https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
            await topTen.reduce(async (memo, user, position) => {
                await memo; // waits for previous to end
                const userInDb = await defineUser(message.client.users.cache.get(user.user_id).id);
                embed.addField(`${position + 1}. ${userInDb.badge || ""}${message.client.users.cache.get(user.user_id).tag}`, `${user.balance}<:ripcoin:929440348831354980>`);
            }, undefined);
        }

        message.channel.send({ embeds: [embed] });
    }
};
