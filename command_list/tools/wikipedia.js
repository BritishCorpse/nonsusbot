const request = require("request");
const { circularUsageOption } = require(`${__basedir}/functions`);

module.exports = {
    name: ["wikipedia", "wiki"],
    description: "Searches Wikipedia for anything you'd like.",

    usage: [
        { tag: "query", checks: {isempty: {not: null}},
            next: [
                circularUsageOption(
                    { tag: "query", checks: {} }
                )
            ]
        }
    ],

    execute (message, args) {
        request("https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=" + args.join(" "), (error, response, body) => {
            parsed_body = JSON.parse(body);
            message.channel.send(parsed_body[1][0] + ": " + parsed_body[3][0]);
        });
    }
}
