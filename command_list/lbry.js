const request = require("request");

module.exports = {
  name: ["lbry", "odysee"],
  category: "Tool",
  description: "Search videos on the LBRY blockchain/odysee.",
  execute (message, args) {
    request("https://lighthouse.lbry.com/search?s=" + args.join(" "), (error, response, body) => {
      parsed_body = JSON.parse(body);

      message.channel.send("https://odysee.com/" + parsed_body[0].name + ":" + parsed_body[0].claimId.slice(0, 6));
    });
  }
}
