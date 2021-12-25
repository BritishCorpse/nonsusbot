module.exports = {
    name: 'balance',
    category: "Currency",
    description: "Shows your balance, or someone else's balance.",
    execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        message.channel.send(`<@!${target.id}> has ${message.client.currency.getBalance(target.id)}💰`);
    }
}
