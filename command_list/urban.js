const request = require("request");
const { MessageEmbed } = new require("discord.js");
const { x_rapidapi_key } = require("../config.json");

const max_number_of_definitions = 2;

module.exports = {
  name: ["urban", "ud"],
  category: "Tool",
  description: "Search the word in the first argument in urban dictionary.",
  execute (message, args) {
    const options = {
      url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
      headers: {
        "x-rapidapi-key": x_rapidapi_key,
        "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
        "useQueryString": true
      },
      qs: {
        "term": args.join(" ")
      }
    }

    request(options, (error, response, body) => {
      parsed_body = JSON.parse(body);
      let embeds = [];

      let number_of_definitions = 0;

      for (const definition of parsed_body.list) {
        if (number_of_definitions >= max_number_of_definitions) break;
        number_of_definitions++;

        const embed = new MessageEmbed()
          .setTitle(definition.word)
          .setURL(definition.permalink)
          .setDescription(definition.definition + "\n\n**Example:**\n" + definition.example)
          .setFooter("By: " + definition.author)
          .setColor("YELLOW")
          .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/UD_logo-01.svg/1280px-UD_logo-01.svg.png");

        embeds.push(embed);
      }

      if (embeds.length === 0) {
        embeds.push(new MessageEmbed());
        embeds[embeds.length - 1].setTitle("No definition found");
        embeds[embeds.length - 1].setDescription("No definition was found");
      }

      for (const embed of embeds) {
        message.channel.send({embeds: [embed]});
      }
    });
  }
}
