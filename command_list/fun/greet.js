module.exports = {
  name: ["greet", "hello"],
  description: "Says hello to anyone!",
  execute (message, args) {
    if (/@/m.test(args.join(" "))) {
      message.channel.send("No no nooo, very baaad! :poop:");
    } else {
      message.channel.send("Hello, " + args.join(" "));
    }
  }
}
