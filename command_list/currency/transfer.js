const { gravestone } = require(`${__basedir}/emojis.json`);

module.exports = {
    name: "transfer",
    description: "Transfer coins from your account to someone else's.",

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
            next: [
                { tag: "amount", checks: {ispositiveinteger: null} }
            ]
        }
    ],

    async execute (message, args) {
        const currentAmount = message.client.currency.getBalance(message.author.id);
        //const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferAmount = args[1];
        const transferTarget = message.mentions.users.first(); // args[0]
           
        if (transferTarget.bot) return message.channel.send(`Sorry ${message.author.username}, you cannot give money to bot accounts.`);
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                                                
        message.client.currency.add(transferTarget.id, transferAmount);
        await message.client.currency.add(message.author.id, -transferAmount); // only need to await this one to show the correct number in the message

        message.channel.send(`Successfully transferred ${transferAmount}${gravestone} to ${transferTarget.tag}. Your remaining balance is: ${message.client.currency.getBalance(message.author.id)}${gravestone}`);
    }
};
