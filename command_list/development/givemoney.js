module.exports = {
    name: ["givemoney"],
    description: "Adds coins to user (not everyone is viable for free coins), second argument is how much money it'll give.",
    developer: true,

    usage: [
        { tag: "amount", checks: {isinteger: null} }
    ],

    async execute (message, args) {
        const moneyAmount = Number.parseInt(args[0]);

        if (moneyAmount.toString() === "NaN") {
            message.client.currency.add(message.author.id, 1000000);
            message.channel.send("You got 1000000<:ripcoin:929759319296192543>");
        } else {
            message.client.currency.add(message.author.id, moneyAmount);
            message.channel.send(`You got ${moneyAmount}<:ripcoin:929759319296192543>`);
        }
    }
};
