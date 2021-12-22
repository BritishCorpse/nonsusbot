module.exports = {
  name: "ping",
  description: "Get this bot's ping",
  execute (message, args) {
    message.channel.send("Calculating ping...")
      .then(sentMessage => {
        sentMessage.edit("Ping: " + (sentMessage.createdTimestamp - message.createdTimestamp) + "ms");
      });
  }
}
