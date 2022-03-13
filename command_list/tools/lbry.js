const request = require("request");
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: ["lbry", "odysee"],
    description: "Searches for videos on the LBRY blockchain/odysee.",
    nsfw: true,

    usage: [
        circularUsageOption(
            { tag: "query", checks: {isempty: {not: null}} }
        )
    ],

    execute (message, args) {
        request("https://lighthouse.lbry.com/search?s=" + args.join(" "), (error, response, body) => {
            const parsedBody = JSON.parse(body);

            if (parsedBody[0] && parsedBody[0].name && parsedBody[0].claimId)
                message.channel.send("https://odysee.com/" + parsedBody[0].name + ":" + parsedBody[0].claimId.slice(0, 9));
            else
                message.channel.send("No LBRY video was found.");
        });
    }
};
