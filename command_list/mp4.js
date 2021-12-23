const request = require("request");
const parse = require("node-html-parser").parse;
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = {
  name: "mp4",
  category: "Tool",
  description: "Search the MP4 URL for a video",
  execute (message, args) {
    let content
    const options = {
      method: "POST",
      url: "https://very.ninja",
      headers: {
        "cookie": "PHPSESSID=ttsmf6rogvjlbklj44ib0ghdl5",
        "content-type": "application/x-www-form-urlencoded"
      },
      body: "url=" + args[0] + "&sid=ttsmf6rogvjlbklj44ib0ghdl5"
    }

    request.post(options, (error, response, body) => {
      const root = parse(body);
      const linkElement = root.querySelector("a[class*='mt-2']")
      if (linkElement === null) {
        message.channel.send("No MP4 video was found");
        return;
      }
      const link = linkElement.getAttribute("href");
      const title = linkElement.getAttribute("download");

      message.channel.send("Getting MP4 file for\n`" + title + "`\n(this might take some time)...")
        .then(() => {
          request(link, (error2, response2, body2) => {
            const buffer = Buffer.from(body2, "utf8");
            if (buffer.byteLength > 8000000) {
              const embed = new MessageEmbed()
                .setDescription("The MP4 file you requested is too large to send through Discord, so here is the [link](" + link + ").");
              message.reply("", embed);
              return;
            }
            const attachment = new MessageAttachment(buffer, title + ".mp4");
            message.reply("here is the MP4 file you requested.", attachment);
          });
        });
    });
  }
}
