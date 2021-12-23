const request = require("request");

module.exports = {
  name: "chat",
  category: "Fun",
  description: "Chat with the bot.",
  execute (message, args) {
    if (/@/m.test(args.join(" "))) {
      message.channel.send("No no nooo, very baaad! :poop:");
      return;
    }

    request("https://api.affiliateplus.xyz/api/chatbot?message=" + args.join(" ") + "&botname=kekbot&ownername=kekbot_owner&user=" + message.channel.id, (error, response, body) => {
      const parsedBody = JSON.parse(body);
      message.channel.send(parsedBody.message);
    });
  }
}
