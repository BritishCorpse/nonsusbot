module.exports = {
    name: 'randomevent',
    execute(client) {
        client.on("messageCreate", async message => {
            if (message.author.bot) return;

            if (Math.random() < 0.002) {

                function randomMoneyAmount() {
                    return Math.floor(Math.random() * 400)
                }

                const moneyAmount = randomMoneyAmount();
                const decidingNumber = Math.floor(Math.random() * 2);

                function selectMathQuestion() {
                    if (decidingNumber === 0)
                        return "+";
                    return "-";
                }

                const mathNumberOne = Math.floor(Math.random() * 100);
                const mathNumberTwo = Math.floor(Math.random() * 100);

                const mathType = selectMathQuestion();

                function randomEventAnswer() {
                    if (decidingNumber === 0)
                        return mathNumberOne + mathNumberTwo;
                    return mathNumberOne - mathNumberTwo;
                }

                let answer = randomEventAnswer();

                message.reply("A random event has happened!");
                message.channel.send(`Math: What is ${mathNumberOne} ${mathType} ${mathNumberTwo}? If you answer correctly, you will get ${moneyAmount}💰`)
                .then(async () => {

                    const filter = m => message.author.id === m.author.id;
                    console.log(message.content);

                    message.channel.awaitMessages({filter, time: 60000, max: 1, errors: ['time']})
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
                        message.channel.send('The random event has ended!');
                    });
                });
            }
        });
    } 
}
