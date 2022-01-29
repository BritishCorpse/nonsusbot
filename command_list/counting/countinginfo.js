const { MessageEmbed } = require("discord.js");
const { Users } = require(`${__basedir}/models/Users`);

module.exports = {
    name: ["countingprofile", "cprofile", "countinginfo", "cinfo"],
    description: "See the amount of numbers a user has counted, how many theyve gotten wrong and how many right!",
    usage: [],
    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const target = message.mentions.users.first() || message.author;

        const userInDb = await Users.findOne({
            where: {user_id: target.id}
        });

        if (!userInDb) {
            message.channel.send("User was not found in the database.");
        }

        const embed = new MessageEmbed()
            .setTitle(`${target}'s counting profile.`)
            .addField("Amount counted:", `${target.amountCounted || "0"}`)
            .addField("Correctly counted:", `${target.countedCorrect || "0"}`)
            .addField("Incorrectly counted:", `${target.amountCounted || 0 - target.countedCorrect || 0}`)
            .setColor(randomColor);

        message.channel.send({ embeds: [embed] });
    }
};
