const request = require("request");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: ["youtube", "yt"],
    description: "Searches for videos on youtube.com then sends the link in the channel.",

    usage: [
        { tag: "query", checks: {isempty: {not: null}},
            next: [
                circularUsageOption(
                    { tag: "query", checks: {} } // repeated because only the first word should not be empty
                )
            ]
        }
    ],

    execute (message, args) {
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
            const parsed_body = JSON.parse(body);

            if (parsed_body.items && parsed_body.items[0])
                message.channel.send("https://youtu.be/" + parsed_body.items[0].id.videoId);
            else
                message.channel.send("No YouTube video was found.");
        });
    }
};
