module.exports = {
  name: ["greet", "hello"],
  category: "Fun",
  description: "Say hello to someone.",
  execute (message, args) {
    if (/@/m.test(args.join(" "))) {
      message.channel.send("No no nooo, very baaad! :poop:");
    } else {
      message.channel.send("Hello, " + args.join(" "));
    }
  }
}
