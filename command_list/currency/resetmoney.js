module.exports = {
    name: 'resetmoney',
    description: "Resets a user's balance back to default.",
    execute(message, args){
        message.client.currency.add(message.author.id, -message.client.currency.getBalance(message.author.id));
        message.channel.send("Balance set to 0💰");
    }
}
