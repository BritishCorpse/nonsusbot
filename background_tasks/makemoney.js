const developmentConfig = require(`${__basedir}/development_config.json`);
const { MessageEmbed } = require('discord.js');
 
module.exports = {
	name: "makemoney",
	execute (client) {
        client.on("messageCreate", message => {
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            const embed = new MessageEmbed()
            .setTitle(`You got lucky!`)
            .setDescription(`+100💰`)
            .setColor("ORANGE")

            if(Math.random() < 0.01) {
                message.reply({ embeds: [embed]});
                message.client.currency.add(message.author.id, 100);
                return;
            }
            message.client.currency.add(message.author.id, 1);
            
        });
	}		
};
