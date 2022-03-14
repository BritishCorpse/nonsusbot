const request = require("request");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: ["youtube", "yt"],
    description: "Searches for videos on YouTube!",

    usage: [
        { tag: "query", checks: {isempty: {not: null}}, circular: true,
            next: [
                circularUsageOption(
                    { tag: "query", checks: {} } // repeated because only the first word should not be empty
                )
            ]
        }
    ],

    async execute (message, args) {
        const options = {
            url: "https://youtube-v31.p.rapidapi.com/search",
            headers: {
                "x-rapidapi-key": x_rapidapi_key,
                "x-rapidapi-host": "youtube-v31.p.rapidapi.com",
                "useQueryString": true
            },
            qs: {
                "part": "snippet",
                "type": "video",
                "maxResults": 1,
                "regionCode": "US",
                "q": args.join(" "),
                "videoCaption": "closedCaption"
            }
        };

        request(options, (error, response, body) => {
            const parsedBody = JSON.parse(body);

            if (parsedBody.items && parsedBody.items[0])
                message.channel.send("https://youtu.be/" + parsedBody.items[0].id.videoId);
            else
                message.channel.send("No YouTube video was found.");
        });
    }
};
