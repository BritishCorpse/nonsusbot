const { developer_discord_user_ids } = require('../development_config.json');


module.exports = {
    name: 'givemoney',
    category: "Currency",
    description: "Adds coins to user(not everyone is viable for free coins), second argument is how much money it'll give.",
    execute (message, args) {
        // Check if user is a developer of this bot
        if (!developer_discord_user_ids.includes(message.author.id)) {
            return message.channel.send("You are not allowed to do this.");
        }

        let moneyAmount = args[0];
        if (!moneyAmount) {
            message.client.currency.add(message.author.id, 2000);
            message.channel.send("You got 2000💰");
        } else {
            message.client.currency.add(message.author.id, moneyAmount);
            message.channel.send(`You got ${moneyAmount}💰`);
        }
        
    }
}
