module.exports = {
    name: 'randomevent',
    execute(client) {
        client.on("messageCreate", async message => {
            if (message.author.bot) return;

            if (Math.random() < 1) {

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
                            return message.channel.send(`${answer}`);
                        }

                        collected.channel.send(`Incorrect`);
                        collected.channel.send(`${answer}`);

                        collected.channel.send("yes")
                        
                    }).catch(() => {
                        message.channel.send('Random event has ended!');
                    });
                });
            }
        });
    } 
}
