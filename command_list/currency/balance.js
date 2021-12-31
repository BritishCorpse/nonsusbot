module.exports = {
    name: ['balance', 'bal'],
    description: "Shows your balance, or someone else's balance.",

    usage: [
        { tag: "nothing" },
        { tag: "user", checks: {isuseringuild: null} }
    ],

    execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        message.channel.send(`<@!${target.id}> has ${message.client.currency.getBalance(target.id)}💰`);
    }
}
