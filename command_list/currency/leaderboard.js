const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "leaderboard",
    description: "Displays the richest users on the leaderboard.",

    usage: [
    ],

    async execute (message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const embed = new MessageEmbed()
            .setTitle("Top 10 Richest People Anywhere")
            .setColor(randomColor);

        await (message.client.currency.sort((a, b) => b.balance - a.balance)
            .filter(user => message.client.users.cache.has(user.user_id))
            .first(10)
            .map((user, position) => `(${position + 1}) ${embed.addField(`${message.client.users.cache.get(user.user_id).tag}`, `${user.balance}💰`)}`)
            .join("\n") || "It would seem, no one exists?");

        message.channel.send({embeds: [embed]});

    }
};
