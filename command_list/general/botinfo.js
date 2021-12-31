const { MessageEmbed } = require('discord.js');
const { bot_name } = require(`${__basedir}/config.json`);
const { developer_discord_user_ids, artist_discord_user_ids } = require(`${__basedir}/development_config.json`);

module.exports = {
    name: 'botinfo',
    description: "Shows information on the bot.",

    usage: [
    ],

    execute (message, args) {
      var randomColor = Math.floor(Math.random()*16777215).toString(16);

      const embed = new MessageEmbed()
          .setColor(randomColor)
          .setTitle(bot_name)
          .setDescription("Graveyard is a powerful bot created to replace many multipurpose bots. There is no premium version of Graveyard, everything is free!")
          .addField('Version', process.env.npm_package_version || require(`${__basedir}/package.json`).version)
          .addField('Creators', `<@!${developer_discord_user_ids.join("> <@!")}>`)
          .addField('Artists', `<@!${artist_discord_user_ids.join("> <@!")}>`)
          .addField('Main library', '[discord.js](https://discord.js.org/)')
          .addField('Servers', `${message.client.guilds.cache.size}`);

      message.channel.send({embeds: [embed]});
    }
}
