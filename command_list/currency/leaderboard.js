const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "leaderboard",
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        async function defineUser(userId) {
            const userInDb = await Users.findOne({ where: { user_id: userId } });
            return userInDb;
        }

        const embed = new MessageEmbed()
            .setTitle("Top 10 Richest People Anywhere")
            .setColor(randomColor);

        async function sendEmbed() {
            message.channel.send({ embeds: [embed] });
        }

        await (message.client.currency.sort((a, b) => b.balance - a.balance)
            .filter(user => message.client.users.cache.has(user.user_id))
            .first(10)
            .map(async (user, position) => {

                const userInDb = await defineUser(message.client.users.cache.get(user.user_id).id);

                console.log(userInDb.badge);

                position++;

                embed.addField(`${position}. ${userInDb.badge || ""}${message.client.users.cache.get(user.user_id).tag}`, `${user.balance}`);
            })
            .join("\n") || "According to my statisticas, there is no one in the database.");

        await new Promise(r => setTimeout(r, 1000)).then(async () => {
            await sendEmbed();
        });


    }
};
