const request = require("request");
const { parse } = require("node-html-parser");
const { createInfiniteCircularUsage } = require(`${__basedir}/functions`);

const max_number_of_articles = 1;

module.exports = {
    name: "britannica",
    description: "Searches articles on Britannica.",

    usage: createInfiniteCircularUsage([
        { tag: "query", checks: {} }
    ]),

    execute (message, args) {
        request("https://www.britannica.com/search?query=test" + args.join(" "), (error, response, body) => {
            const root = parse(body);
      
            const articles = root.querySelectorAll("li[class='mb-45']").splice(0, max_number_of_articles);

            for (const article of articles) {
                let responseMessage = article.querySelector("a").innerHTML.trim();
                responseMessage += ": https://www.britannica.com";
                responseMessage += article.querySelector("a").getAttribute("href");
        
                message.channel.send(responseMessage);
            }

            //message.channel.send(parsed_body[1][0] + ": " + parsed_body[3][0]);
        });
    }
}
