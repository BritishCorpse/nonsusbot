const request = require("request");
const { MessageEmbed } = require("discord.js");
const { parse } = require("node-html-parser");
const { paginateEmbeds, circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: ["bible"],
    description: "Get bible verses. Topic is the first argument.",

    usage: [
        circularUsageOption(
            { tag: "topic", checks: {matches: {not: /[^a-zA-Z]/}, isempty: {not: null}} }
        )
    ],

    async execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
  
        request("https://www.openbible.info/topics/" + args.join("_"), (error, response, body) => {
            const root = parse(body);
            const verses = root.querySelectorAll("div[class^='verse']");

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
};
