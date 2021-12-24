module.exports = {
    name: 'givemoney',
    category: "Currency",
    description: "Get free money (for testing).",
    execute (message, args) {
        if (message.author.id !== '484644637420552202' && message.author.id !== '907114729707806740') {
            return message.channel.send("You are not the correct person")
        }
        message.client.currency.add(message.author.id, 2000);
        message.channel.send("You got 2000💰");
    }
}
