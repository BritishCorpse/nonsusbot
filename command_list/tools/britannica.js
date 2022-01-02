const request = require("request");
const { parse } = require("node-html-parser");
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "britannica",
    description: "Searches articles on Britannica.",

    usage: [
        circularUsageOption(
            { tag: "query", checks: {isempty: {not: null}} }
        )
    ],

    execute (message, args) {
        request("https://www.britannica.com/search?query=test" + args.join(" "), (error, response, body) => {
            const root = parse(body);
      
            const articles = root.querySelectorAll("li[class='mb-45']").splice(0, 1);

            for (const article of articles) {
                let responseMessage = article.querySelector("a").innerHTML.trim();
                responseMessage += ": https://www.britannica.com";
                responseMessage += article.querySelector("a").getAttribute("href");
        
                message.channel.send(responseMessage);
            }
        });
    }
};
