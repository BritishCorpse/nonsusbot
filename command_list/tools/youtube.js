const request = require("request");
const { x_rapidapi_key } = require(`${__basedir}/config.json`);
const { createInfiniteCircularUsage } = require(`${__basedir}/functions`);


module.exports = {
    name: ["youtube", "yt"],
    description: "Searches for videos on youtube.com then sends the link in the channel.",

    usage: createInfiniteCircularUsage([
        { tag: "query", checks {} }
    ]),

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
        }

        request(options, (error, response, body) => {
            parsed_body = JSON.parse(body);

            message.channel.send("https://youtu.be/" + parsed_body.items[0].id.videoId);
        });
    }
}
