module.exports = {
  name: ["greet", "hello"],
  execute (message, args) {
    if (/@/m.test(args.join(" "))) {
      message.channel.send("No no nooo, very baaad! :poop:");
    } else {
      message.channel.send("Hello, " + args.join(" "));
    }
  }
}
