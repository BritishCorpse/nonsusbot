const request = require("request");
const x_rapidapi_key = require("../config.json").x_rapidapi_key;

const max_number_of_results = 1;

module.exports = {
  name: "population",
  description: "Find the population of a country.",
  execute (message, args) {
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
    }

    request(options, (error, response, body) => {
      parsed_body = JSON.parse(body);
      if (parsed_body.ok) {
        if (parsed_body.body.world_population !== undefined) {
          message.channel.send("The world has a popualtion of " + parsed_body.body.world_population + " in " + parsed_body.body.total_countries + " countries.");
        } else {
          message.channel.send(args.join(" ") + " has a population of " + parsed_body.body.population + " and ranks #" + parsed_body.body.ranking + " in the world.");
        }
      } else {
        message.channel.send("Please provide a valid country.");
      }
    });
  }
}
