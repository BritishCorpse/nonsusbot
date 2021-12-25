module.exports = {
  name: "ping",
  category: "Configuration",
  description: "Sends the bot's ping in chat.",
  execute (message, args) {
    message.channel.send("Calculating ping...")
      .then(sentMessage => {
        sentMessage.edit("Ping: " + (sentMessage.createdTimestamp - message.createdTimestamp) + "ms");
      });
  }
}
