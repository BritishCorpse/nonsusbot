const { MessageEmbed } = require("discord.js");

const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: ["casinobalance", "casinobal"],
    description: "See how much the casino has earned!",
    usage: [],
    async execute(message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const embed = new MessageEmbed()
            .setTitle(`Casino's worth: ${message.client.currency.getBalance("1")}${gravestone}`)
            .setColor(randomColor);

        message.channel.send({ embeds: [embed] });
    }
};