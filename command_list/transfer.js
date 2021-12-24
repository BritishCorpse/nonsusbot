const { Users } = require('../db_objects');


module.exports = {
    name: 'transfer',
    category: "Currency",
    description: "Transfer some of your money to someone.",
    execute (message, args) {
        const currentAmount = message.client.currency.getBalance(message.author.id);
        //const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferAmount = args[1];
        const transferTarget = message.mentions.users.first(); // args[0]
                        
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);
                                                
        message.client.currency.add(message.author.id, -transferAmount);
        message.client.currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${message.client.currency.getBalance(message.author.id)}💰`);
    }
}
