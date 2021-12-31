const request = require("request");
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: ["lbry", "odysee"],
    description: "Searches for videos on the LBRY blockchain/odysee.",

    usage: [
        circularUsageOption(
            { tag: "query", checks: {isempty: {not: null}} }
        )
    ],

    execute (message, args) {
        request("https://lighthouse.lbry.com/search?s=" + args.join(" "), (error, response, body) => {
            parsed_body = JSON.parse(body);

            if (parsed_body[0] && parsed_body[0].name && parsed_body[0].claimId)
                message.channel.send("https://odysee.com/" + parsed_body[0].name + ":" + parsed_body[0].claimId.slice(0, 9));
            else
                message.channel.send("No LBRY video was found.");
        });
    }
}
