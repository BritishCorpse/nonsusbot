const request = require("request");
const { MessageEmbed } = new require("discord.js");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { circularUsageOption } = require(`${__basedir}/functions`);
const { paginateEmbeds } = require(`${__basedir}/functions`);


module.exports = {
    name: ["urban", "ud"],
    description: "Searches Urban Dictionary for anything you'd like.",
    nsfw: true,

    usage: [
        { tag: "query", checks: {isempty: {not: null}},
            next: [
                circularUsageOption(
                    { tag: "query" } // repeated because only the first word has to not be empty
                )
            ]
        }
    ],

    execute (message, args) {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

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
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            const embeds = [];

            if (body.toLowerCase().includes("loli")
                || body.toLowerCase().includes("pedo")
                || body.toLowerCase().includes("paedo")
                || body.toLowerCase().includes("rape")
            ) {
                message.reply("Unfortunately, this definition cannot be shared with you.");
                return;
            }


            for (const definition of parsedBody.list) {
                const embed = new MessageEmbed()
                    .setTitle(definition.word)
                    .setURL(definition.permalink)
                    .setDescription(definition.definition + "\n\n**Example:**\n" + definition.example)
                    .setFooter({text: `By: ${definition.author}`})
                    .setColor(randomColor)
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/UD_logo-01.svg/1280px-UD_logo-01.svg.png");

                embeds.push(embed);
            }

            if (embeds.length === 0) {
                const embed = new MessageEmbed()
                    .setTitle("No definition found")
                    .setDescription("No definition was found");
                message.channel.send({embeds: [embed]});
            } else {
                paginateEmbeds(message.channel, message.author, embeds);
            }
        });
    }
};
