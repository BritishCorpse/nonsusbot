const { MessageEmbed } = require("discord.js");
const { bot_name } = require(`${__basedir}/config.json`);
const { developer_shoutouts, artist_shoutouts, translator_shoutouts } = require(`${__basedir}/development_config.json`);

module.exports = {
    name: ["info"],
    description: "Shows information on the bot.",

    usage: [
    ],

    async execute (message) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        const embed = new MessageEmbed()
            .setColor(randomColor)
            .setTitle(bot_name)
            .setDescription("Graveyard is a powerful Discord bot, which eliminates the need to fill up your server with an unnecessarily large amount of bots!")
            .setURL("https://talloween.github.io/graveyardbot/")
            .setThumbnail(message.client.user.avatarURL())
            .addField("Version", require(`${__basedir}/package.json`).version)
            .addField("Developers", `${developer_shoutouts.join("")}`)
            .addField("Artists", `${artist_shoutouts.join("")}`)
            .addField("Tranlators", `${translator_shoutouts.join("")}`)
            .addField("Made with", "[discord.js](https://discord.js.org/)")
            .addField("Servers", `${message.client.guilds.cache.size}`);

        message.channel.send({embeds: [embed]});
    }
};
