module.exports = {
    name: 'resetmoney',
    category: 'Currency',
    description: "Resets a user's balance back to zero.",
    execute(message, args){
        message.client.currency.add(message.author.id, -message.client.currency.getBalance(message.author.id));
        message.channel.send("Balance set to 0💰");
    }
}