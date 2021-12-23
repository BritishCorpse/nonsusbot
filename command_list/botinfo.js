const { MessageEmbed } = require('discord.js');
const { bot_name } = require('../config.json');


module.exports = {
    name: 'botinfo',
    category: "General",
    description: "Show information on the bot.",
    execute (message, args) {
      const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(bot_name)
          .addFields(
              {name: 'Creators', value: '<@!484644637420552202> (and <@!786301097953591326>)'},
              {name: 'Main library', value: 'discord.js'}
          );

      message.channel.send(embed);
    }
}
