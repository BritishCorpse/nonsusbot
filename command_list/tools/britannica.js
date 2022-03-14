const request = require("request");
const { parse } = require("node-html-parser");
const { circularUsageOption, formatBacktick } = require(`${__basedir}/functions`);


module.exports = {
    name: "britannica",
    description: "Searches articles on Britannica.",
    nsfw: true,

    usage: [
        circularUsageOption(
            { tag: "query", checks: {isempty: {not: null}} }
        )
    ],

    async execute (message, args) {
        request("https://www.britannica.com/search?query=" + args.join(" "), (error, response, body) => {
            const root = parse(body);

            if (body.toLowerCase().includes("loli")
                || body.toLowerCase().includes("pedo")
                || body.toLowerCase().includes("paedo")
                || body.toLowerCase().includes("rape")
            ) {
                message.reply("Unfortunately, this definition cannot be shared with you.");
                return;
            }

            const articles = root.querySelectorAll("li[class*='RESULT-']").splice(0, 1);

            if (articles.length === 0) {
                message.channel.send(`No article meeting your search query ${formatBacktick(args.join(" "))} was found on Britannica.`);
                return;
            }

            for (const article of articles) {
                let responseMessage = article.querySelector("a").innerHTML.trim();
                responseMessage += ": https://www.britannica.com";
                responseMessage += article.querySelector("a").getAttribute("href");
        
                message.channel.send(responseMessage);
            }
        });
    }
};
