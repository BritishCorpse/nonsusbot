const { MessageEmbed } = require("discord.js");

module.exports = {
    name: ["love"],
    description: "Find out your compatibility with other server members!",
    usage: [],
    async execute(message) {
        const target = message.mentions.users.first() || message.author;

        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const affinity = Math.floor(Math.random() * 100 + 10);

        const embed = new MessageEmbed()
            .setTitle(`**${message.author.username}** and **${target.username}** are ${affinity}% compatible!`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(randomColor);
        
        if (affinity < 30) {
            embed.setTitle(`**${message.author.username}** and **${target.username}** have a ${affinity}% compatibility. Yikes.`);
        }

        if (affinity > 100) {
            embed.setTitle(`**${message.author.username}** and **${target.username}** are ${affinity}% compatible! That's fantastic!`);
        }

        message.channel.send({embeds: [embed]});
    }
};
