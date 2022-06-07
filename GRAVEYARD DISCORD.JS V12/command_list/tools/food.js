const request = require("request");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { MessageEmbed } = require("discord.js");
const { circularUsageOption } = require(`${__basedir}/utilities`);


function embedFromFoodData(foodData, index, maxIndex) {
    const embed = new MessageEmbed()
        .setTitle(foodData.label)
        .setThumbnail(foodData.image)
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setAuthor({name: `Page ${index}/${maxIndex}`});

    for (const value in foodData) {
        if (value !== "label" && value !== "uri" && value !== "foodId" && value !== "nutrients" && value !== "image") {
            embed.addField(value[0].toUpperCase() + value.replace(/([a-z])([A-Z])/g, "$1 $2").slice(1), foodData[value], true);
        }
    }

    let descriptionString = "";
    for (const nutrient in foodData.nutrients) {
        descriptionString += "**" + nutrient + ":** " + (Math.round(foodData.nutrients[nutrient] * 100) / 100) + "\n";
    }
    embed.setDescription(descriptionString);

    return embed;
}


module.exports = {
    name: ["food"],
    description: "Searches for nutritional values for food items, then sends it in the channel.",

    usage: [
        circularUsageOption(
            { tag: "food", checks: {isempty: {not: null}} }
        )
    ],

    async execute (message, args) {
        const options = {
            url: "https://edamam-food-and-grocery-database.p.rapidapi.com/parser",
            headers: {
                "x-rapidapi-key": x_rapidapi_key,
                "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
                "useQueryString": true
            },
            qs: {
                "ingr": args.join(" ")
            }
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            
            if (parsedBody.parsed === undefined) {
                message.channel.send("No food was found.");
                return;
            }

            const allFoods = [];
            allFoods.push(...parsedBody.parsed.map(a => a.food));
            allFoods.push(...parsedBody.hints.map(a => a.food));

            if (allFoods.length === 0) {
                message.channel.send("No food was found.");
                return;
            }

            let index = 0; // index in the allFood array

            message.channel.send({embeds: [embedFromFoodData(allFoods[index], index + 1, allFoods.length)]})
                .then(sentMessage => {
                    sentMessage.react("⏪");
                    sentMessage.react("◀️");
                    sentMessage.react("▶️");
                    sentMessage.react("⏩");

                    function moveIndex(reaction, user) {
                        if (reaction.message.id === sentMessage.id
                        && user.id === message.author.id) {

                            if (reaction._emoji.name === "▶️") {
                                if (index < allFoods.length - 1) {
                                    index++;
                                }
                            } else if (reaction._emoji.name === "◀️") {
                                if (index > 0) {
                                    index--;
                                }
                            } else if (reaction._emoji.name === "⏪") {
                                index = 0;
                            } else if (reaction._emoji.name === "⏩") {
                                index = allFoods.length - 1;
                            }

                            sentMessage.edit(embedFromFoodData(allFoods[index], index + 1, allFoods.length));
                        }
                    }

                    message.client.on("messageReactionAdd", moveIndex);
                    message.client.on("messageReactionRemove", moveIndex);
                });
        });
    }
};
