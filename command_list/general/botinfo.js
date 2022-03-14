const { MessageEmbed } = require("discord.js");
const { bot_name } = require(`${__basedir}/config.json`);
const { developer_discord_user_ids, artist_discord_user_ids, translator_discord_user_ids } = require(`${__basedir}/development_config.json`);

module.exports = {
    name: "botinfo",
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
            .setThumbnail("https://cdn.discordapp.com/avatars/825779650822275152/3b40ed3b6e37de5018ec2bce8794ddb4.png?size=256")
            .addField("Version", require(`${__basedir}/package.json`).version)
            .addField("Creators", `<@!${developer_discord_user_ids.join("> <@!")}>`)
            .addField("Artists", `<@!${artist_discord_user_ids.join("> <@!")}>`)
            .addField("Tranlators", `<@!${translator_discord_user_ids.join("> <@!")}>`)
            .addField("Made with", "[discord.js](https://discord.js.org/)")
            .addField("Servers", `${message.client.guilds.cache.size}`);

        message.channel.send({embeds: [embed]});
    }
};
