module.exports = {
    name: 'randomevent',
    execute(client) {
            client.on("messageCreate", async message => {
                if(Math.random() < 1) {

                    if (message.author.bot) {
                        return;
                    }

                    function randomMoneyAmount() {
                        return Math.floor(Math.random() * 400)
                    }

                    let moneyAmount = randomMoneyAmount();
                    let decidingNumber = Math.floor(Math.random() * 2);

                    function selectMathQuestion() {
                        if (decidingNumber === 0) {
                            return "+"
                        }

                        else {
                            return "-"
                        }
                    }

                    let mathNumberOne = Math.floor(Math.random() * 100)
                    let mathNumberTwo = Math.floor(Math.random() * 100)

                    let mathType = selectMathQuestion();

                    function randomEventAnswer() {
                        if (decidingNumber === 0) {
                            return mathNumberOne + mathNumberTwo
                        }

                        else {
                            return mathNumberOne - mathNumberTwo
                        }
                    }

                    let answer = randomEventAnswer()

                    message.reply("A random event has happened!")
                    message.channel.send(`Math: What is ${mathNumberOne} ${mathType} ${mathNumberTwo}? If you answer correctly, you will get ${moneyAmount}💰`).then(async () => {
                        const filter = m => message.author.id === m.author.id;
                        console.log(message.content)

                        message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] }).then(async messages => {
                                
                                console.log(messages.first().content)
                                if (messages.first().content === answer) {
                                    return message.channel.send(`${answer}`);
                                }

                                messages.channel.send(`Incorrect`);
                                messages.channel.send(`${answer}`);

                                messages.channel.send("yes")
                                
                            })

                            .catch(() => {
                                messages.channel.send('Random event has ended!');
                            });
                    });
          

                }
            })
    } 
}