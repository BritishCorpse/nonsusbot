const request = require("request");
const { MessageEmbed } = new require("discord.js");
const parse = require("node-html-parser").parse;

const max_number_of_verses = 1;

module.exports = {
  name: "bible",
  description: "Get bible verses. Put topic in first argument.",
  execute (message, args) {
    request("https://www.openbible.info/topics/" + args.join(" "), (error, response, body) => {
      const root = parse(body);
      const verses = root.querySelectorAll("div[class^='verse']").splice(0, max_number_of_verses);

      for (const verse of verses) {
        const embed = new MessageEmbed()
          .setTitle(verse.querySelector("a").innerHTML.trim())
          .setDescription(verse.querySelector("p").innerHTML
            .trim()
            .replace("&rdquo;", "\"")
            .replace("&ldquo;", "\"")
            .replace(/<\/?.+?>/g, ""))
          .setURL(verse.querySelector("a").getAttribute("href"));
        message.channel.send(embed);
      }
    });
  }
}
