const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "math", 
    description: "Solve a mathematical equation for a random amount of ripcoin!",
    usage: [],
    execute(message) {

        const firstNumber = Math.floor(Math.random() * 10000);
        const secondNumber = Math.floor(Math.random() * 3000);
        const thirdNumber = Math.floor(Math.random() * 10);

        const answer = firstNumber + secondNumber * thirdNumber;

        const moneyAmount = Math.floor(Math.random() * 2000) + 1000;

        const embed = new MessageEmbed()
            .setTitle(`Solve the equation! ${firstNumber} + ${secondNumber} * ${thirdNumber}`)
            .setColor(Math.floor(Math.random()*16777215).toString(16));

        message.reply({ embeds: [embed]})
            .then(async () => {

                const filter = m => message.author.id === m.author.id;

                message.channel.awaitMessages({filter, time: 30000, max: 1, errors: ["time"]})
                    .then(async collected => {

                        if (collected.first().content === answer.toString()) {
                            message.channel.send(`The answer is ${answer}. You were correct!\n+${moneyAmount}💰`);
                            message.client.currency.add(message.author.id, moneyAmount);
                            return;
                        }

                        else {
                            message.channel.send("The answer is incorrect! Try again later!");
                            return;
                        }
                
                    }).catch(() => {
                        message.reply("Time ran out!");
                    });
            });
    }
};
