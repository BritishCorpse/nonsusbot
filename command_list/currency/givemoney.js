const { developer_discord_user_ids, development_discord_server_ids } = require(`${__basedir}/development_config.json`);


module.exports = {
    name: 'givemoney',
    description: "Adds coins to user (not everyone is viable for free coins), second argument is how much money it'll give.",
    developer: true,
    execute (message, args) {
        let moneyAmount = Number.parseInt(args[0]);

        if (moneyAmount.toString() === 'NaN') {
            message.client.currency.add(message.author.id, 2000);
            message.channel.send("You got 2000💰");
        } else {
            message.client.currency.add(message.author.id, moneyAmount);
            message.channel.send(`You got ${moneyAmount}💰`);
        }
    }
}
