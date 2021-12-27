module.exports = {
	name: "makemoney",
	execute (client) {
        client.on("messageCreate", message => {
            if (message.author.bot) return;
            message.client.currency.add(message.author.id, 1);
        });
	}		
};
