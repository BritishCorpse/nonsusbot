const request = require("request");
const { MessageEmbed } = new require("discord.js");
const { dictionary_api_key } = require(`${__basedir}/config.json`);

const max_number_of_definitions = 2;

module.exports = {
    name: 'define',
    description: "Define the first argument. Optionally include the type of the word (noun, verb, adjective, adverb, etc) as the second argument.",

    usage: [
        { tag: "word", checks: {matches: {not: /[^a-zA-Z-]/}, isempty: {not: null}},
            next: [
                { tag: "type", checks: {matches: {not: /[^a-zA-Z]/}, isempty: {not: null}} },
                { tag: "nothing", checks: {isempty: null} }
            ]
        }
    ],

    execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        request("https://dictionaryapi.com/api/v3/references/collegiate/json/" + args[0] + "?key=" + dictionary_api_key, (error, response, body) => {
            const parsed_body = JSON.parse(body);
            let embeds = [];

            let number_of_definitions = 0;

            if (typeof parsed_body[0] === "string") {
              const embed = new MessageEmbed()
                  .setTitle("Similar words")
                  .setColor(randomColor)
                  .setDescription(parsed_body.join(", "))
                  .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                  .setURL("https://www.merriam-webster.com/dictionary/" + args[0]);
              embeds.push(embed);
            } else {
                for (const type of parsed_body) { // each word type, noun, adj, etc
                    if ((args[1] !== undefined && type.fl !== args[1])
                        || type.shortdef.length === 0 || type.fl === undefined) continue;
                    if (number_of_definitions >= max_number_of_definitions) break;
                    number_of_definitions++;

                    let embed = new MessageEmbed()
                        .setTitle(type.meta.id.split(":")[0] + " - *" + type.fl + "*")
                        .setColor(randomColor)
                        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
                        .setURL("https://www.merriam-webster.com/dictionary/" + args[0]);

                    let definitions = "";
                    for (let i = 0; i < type.shortdef.length; ++i) {
                        definitions += (i + 1) + " - ";
                        definitions += type.shortdef[i];
                        definitions += "\n";
                    }
                    embed.setDescription(definitions);

                    if (type.meta.offensive) {
                        embed.setFooter("is offensive");
                    }

                    embeds.push(embed);
                }
            }

            if (embeds.length === 0) {
                embeds.push(new MessageEmbed()
                    .setTitle("No definition found")
                    .setDescription("No definition was found with type *" + args[1] + "*")
                );
            }

            for (const embed of embeds) {
                message.channel.send({embeds: [embed]});
            }

            //if (embeds.length < parsed_body.length) {
            //    message.channel.send("Maximum amount of definitions (" + max_number_of_definitions + ") was reached.");
            //}
        });
    }
}
