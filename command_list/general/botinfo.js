const { MessageEmbed } = require('discord.js');
const { bot_name } = require('../config.json');
const { developer_discord_user_ids } = require('../development_config.json');


module.exports = {
    name: 'botinfo',
    category: "General",
    description: "Shows information on the bot.",
    execute (message, args) {
      const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(bot_name)
          .addFields(
              {name: 'Creators', value: `<@!${developer_discord_user_ids.join("> <@!")}>`},
              {name: 'Main library', value: 'discord.js'}
          )
          .setDescription("Graveyard is a powerful bot created to replace many multipurpose bot. There is no premium version of Graveyard, everything is free!");

      message.channel.send({embeds: [embed]});
    }
}
