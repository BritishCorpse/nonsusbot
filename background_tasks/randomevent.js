function randomMoneyAmount() {
    return Math.floor(Math.random() * 400);
}


function selectMathQuestion(decidingNumber) {
    if (decidingNumber === 0)
        return "+";
    return "-";
}


module.exports = {
    name: "randomevent",
    execute(client) {
        client.on("messageCreate", async message => {
            //const randomColor = Math.floor(Math.random()*16777215).toString(16);
            
            if (message.author.bot) return;
            
            // don't do random events in special channels!
            if (Object.values(message.client.serverConfig.get(message.guild.id)).includes(message.channel.id))
                return;

            if (Math.random() < 0.002) {
                const moneyAmount = randomMoneyAmount();
                const decidingNumber = Math.floor(Math.random() * 2);

                const mathNumberOne = Math.floor(Math.random() * 100);
                const mathNumberTwo = Math.floor(Math.random() * 100);

                const mathType = selectMathQuestion(decidingNumber);

                const answer = mathNumberOne + (mathNumberTwo * (decidingNumber === 0 ? 1 : -1));

                message.reply("A random event has happened!");
                message.channel.send(`Math: What is ${mathNumberOne} ${mathType} ${mathNumberTwo}? If you answer correctly, you will get ${moneyAmount}💰`)
                    .then(async () => {

                        const filter = m => message.author.id === m.author.id;

                        message.channel.awaitMessages({filter, time: 60000, max: 1, errors: ["time"]})
                            .then(async collected => {

                                if (collected.first().content === answer.toString()) {
                                    message.channel.send(`The answer is ${answer}. You were correct!\n+${moneyAmount}💰`);
                                    message.client.currency.add(message.author.id, moneyAmount);
                                    return;
                                }

                                else {
                                    message.channel.send("Incorrect answer! The event has ended.");
                                    return;
                                }
                        
                            }).catch(() => {
                                message.channel.send("The random event has ended!");
                            });
                    });
            }
        });
    } 
};
