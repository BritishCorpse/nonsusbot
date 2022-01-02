module.exports = {
    name: "givemoney",
    description: "Adds coins to user (not everyone is viable for free coins), second argument is how much money it'll give.",
    developer: true,

    usage: [
        { tag: "amount", checks: {isinteger: null} }
    ],

    execute (message, args) {
        const moneyAmount = Number.parseInt(args[0]);

        if (moneyAmount.toString() === "NaN") {
            message.client.currency.add(message.author.id, 2000);
            message.channel.send("You got 2000💰");
        } else {
            message.client.currency.add(message.author.id, moneyAmount);
            message.channel.send(`You got ${moneyAmount}💰`);
        }
    }
};
