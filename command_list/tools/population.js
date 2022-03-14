const request = require("request");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "population",
    description: "Finds the population of a country, then sends it in the channel.",

    usage: [
        circularUsageOption(
            { tag: "country", checks: {matches: {not: /[^a-zA-Z'-]/}, isempty: {not: null}} }
        ),
        { tag: "nothing", checks: {isempty: null} }
    ],

    async execute (message, args) {
        let apiURL;
        if (args.join(" ") === undefined || args.join(" ") === "") {
            apiURL = "https://world-population.p.rapidapi.com/worldpopulation";
        } else {
            apiURL = "https://world-population.p.rapidapi.com/population";
        }

        const options = {
            url: apiURL,
            headers: {
                "x-rapidapi-key": x_rapidapi_key,
                "x-rapidapi-host": "world-population.p.rapidapi.com",
                "useQueryString": true
            },
            qs: {
                "country_name": args.join(" ")
            }
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            if (parsedBody.ok) {
                if (parsedBody.body.world_population !== undefined) {
                    message.channel.send("The world has a population of " + parsedBody.body.world_population + " in " + parsedBody.body.total_countries + " countries.");
                } else {
                    message.channel.send(args.join(" ") + " has a population of " + parsedBody.body.population + " and ranks #" + parsedBody.body.ranking + " in the world.");
                }
            } else {
                message.channel.send("Please provide a valid country.");
            }
        });
    }
};
