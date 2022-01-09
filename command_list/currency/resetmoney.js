module.exports = {
    name: "resetmoney",
    description: "Resets a user's balance back to default.",
    developer: true,

    usage: [
    ],

    execute(message){
        message.client.currency.setBalance(message.author.id, 0);
        message.channel.send("Balance set to 0 <:ripcoin:929440348831354980>");
    }
};
