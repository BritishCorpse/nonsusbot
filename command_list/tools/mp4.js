const request = require("request");
const { parse } = require("node-html-parser");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const { very_ninja_php_session_id } = require(`${__basedir}/config.json`);

module.exports = {
    name: "mp4",
    description: "Searches for the MP4 file of any video you want.",

    // regex from http://urlregex.com
    usage: [
        { tag: "url",
            checks: {
                matchesfully: /[a-zA-Z]+:\/\/.+?(\..+?)+/
            }
        }
    ],

    execute (message, args) {
        message.channel.send("The MP4 command is currently broken. We apologize for the inconvenience.");
        return;

        const options = {
            method: "POST",
            url: "https://very.ninja",
            headers: {
                "cookie": "PHPSESSID=" + very_ninja_php_session_id,
                "content-type": "application/x-www-form-urlencoded"
            },
            body: "url=" + args[0] + "&sid=" + very_ninja_php_session_id
        };

        request.post(options, (error, response, body) => {
            const root = parse(body);
            const linkElement = root.querySelector("a[class*='mt-2']");
            if (linkElement === null) {
                message.channel.send("No MP4 video was found");
                return;
            }
            const link = linkElement.getAttribute("href");
            const title = linkElement.getAttribute("download");

            message.channel.send("Getting MP4 file for\n`" + title + "`\n(this might take some time)...")
                .then(() => {
                    request(link, (error2, response2, body2) => {
                        const buffer = Buffer.from(body2, "utf8");
                        if (buffer.byteLength > 8000000) {
                            const embed = new MessageEmbed()
                                .setDescription("The MP4 file you requested is too large to send through Discord, so here is the [link](" + link + ").");
                            message.reply("", embed);
                            return;
                        }
                        const attachment = new MessageAttachment(buffer, title + ".mp4");
                        message.reply("here is the MP4 file you requested.", attachment);
                    });
                });
        });
    }
};
