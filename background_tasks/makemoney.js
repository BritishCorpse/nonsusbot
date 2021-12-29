const developmentConfig = require(`${__basedir}/development_config.json`)


module.exports = {
	name: "makemoney",
	execute (client) {
        client.on("messageCreate", message => {
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;
            message.client.currency.add(message.author.id, 1);
        });
	}		
};
