module.exports = {
    name: 'givemoney',
    category: "Currency",
    description: "Adds coins to user(not everyone is viable for free coins), second argument is how much money it'll give.",
    execute (message, args) {
        if (message.author.id !== '484644637420552202' && message.author.id !== '907114729707806740') {
            return message.channel.send("You are not the correct person")
        }

        let moneyAmount = args[0];
        if (!moneyAmount) {
            message.client.currency.add(message.author.id, 2000);
            message.channel.send("You got 2000💰");
        }
        else {
            message.client.currency.add(message.author.id, moneyAmount);
            message.channel.send(`You got ${moneyAmount}💰`)
        };
        
    }
}
