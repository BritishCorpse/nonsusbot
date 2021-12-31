const request = require("request");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const { paginateEmbeds } = require(`${__basedir}/functions`);

//const max_number_of_verses = 3;

module.exports = {
  name: "bible",
  description: "Get bible verses. Topic is the first argument.",
  execute (message, args) {
      var randomColor = Math.floor(Math.random()*16777215).toString(16);

      request("https://www.openbible.info/topics/" + args.join("_"), (error, response, body) => {
          const root = parse(body);
          const verses = root.querySelectorAll("div[class^='verse']");//.splice(0, max_number_of_verses);
          console.log(verses.length);

          const pages = [];

          for (const verse of verses) {
              const embed = new MessageEmbed()
                  .setTitle(verse.querySelector("a").innerHTML.trim() + " (ESV)")
                  .setColor(randomColor)
                  .setDescription(
                      verse.querySelector("p").innerHTML
                          .trim()
                          .replace(/&rdquo;/g, "\"")
                          .replace(/&ldquo;/g, "\"")
                          .replace(/<\/?.+?>/g, "")
                  )
                  .setURL(verse.querySelector("a").getAttribute("href"));
              
              pages.push(embed);
          }

          paginateEmbeds(message.channel, message.author, pages);
      });
  }
}
