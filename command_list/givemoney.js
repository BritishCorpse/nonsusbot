module.exports = {
    name: 'givemoney',
    category: "Currency",
    description: "Get free money (for testing).",
    execute (message, args) {
        message.client.currency.add(message.author.id, 2000);
        message.channel.send("You got 2000💰");
    }
}
