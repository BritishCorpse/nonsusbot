module.exports = {
    name: "ping",
    description: "Sends the bot's ping in chat.",

    usage: [
    ],

    execute (message, args) {
        message.channel.send("Calculating ping...")
        .then(sentMessage => {
            sentMessage.edit("Ping: " + (sentMessage.createdTimestamp - message.createdTimestamp) + "ms");
        });
    }
}
