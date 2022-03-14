module.exports = {
    name: "ping",
    description: "Sends the bot's ping in chat.",

    usage: [
    ],

    async execute (message) {
        message.channel.send("Calculating ping...")
            .then(sentMessage => {
                sentMessage.edit(`Roundtrip latency: ${(sentMessage.createdTimestamp - message.createdTimestamp)}ms\nWebsocket ping: ${message.client.ws.ping}ms`);
            });
    }
};
