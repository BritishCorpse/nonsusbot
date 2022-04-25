const request = require("request");
const { circularUsageOption } = require(`${__basedir}/utilities`);

module.exports = {
    name: ["wikipedia", "wiki"],
    description: "Searches Wikipedia for anything you'd like.",
    nsfw: true,

    usage: [
        { tag: "query", checks: {isempty: {not: null}}, circular: true,
            next: [
                circularUsageOption(
                    { tag: "query", checks: {} }
                )
            ]
        }
    ],

    async execute (message, args) {
        request("https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=" + args.join(" "), (error, response, body) => {
            const parsedBody = JSON.parse(body);

            if (parsedBody[3].length === 0) {
                message.reply("Definition not found.");
                return;
            }

            if (parsedBody[3][0].toLowerCase().includes("loli")
                || parsedBody[3][0].toLowerCase().includes("pedo")
                || parsedBody[3][0].toLowerCase().includes("paedo")
                || parsedBody[3][0].toLowerCase().includes("rape")
            ) {
                message.reply("Unfortunately, this search result cannot be shared with you.");
                return;
            }

            message.channel.send(parsedBody[1][0] + ": " + parsedBody[3][0]);
        });
    }
};
