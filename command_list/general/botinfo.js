const { MessageEmbed } = require('discord.js');
const { bot_name } = require(`${__basedir}/config.json`);
const { developer_discord_user_ids } = require(`${__basedir}/development_config.json`);


module.exports = {
    name: 'botinfo',
    description: "Shows information on the bot.",
    execute (message, args) {
      const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(bot_name)
          .setDescription("Graveyard is a powerful bot created to replace many multipurpose bot. There is no premium version of Graveyard, everything is free!")
          .addField('Creators', `<@!${developer_discord_user_ids.join("> <@!")}>`)
          .addField('Main library', '[discord.js](https://discord.js.org/)')
          .addField('Servers', `${message.client.guilds.cache.size}`);

      message.channel.send({embeds: [embed]});
    }
}
