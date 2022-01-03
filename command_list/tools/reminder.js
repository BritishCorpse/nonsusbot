const { circularUsageOption } = require(`${__basedir}/functions`);


function plural(number) {
    return number !== 1 ? "s" : "";
}


module.exports = {
    name: ["reminder", "remind"],
    description: "Reminds you about something.",

    usage: [
        { tag: "time",
            checks: {
                matchesfully: /(?:0*([1-7])d)?(?:0*((?:\d)|(?:1\d)|(?:2[0-3]))h)?(?:0*((?:\d)|(?:[1-5]\d))m)?(?:0*((?:\d)|(?:[1-5]\d))s)?/
            },
            next: [
                { tag: "message", checks: {isempty: {not: null}}, circular: true,
                    next: [
                        circularUsageOption(
                            { tag: "message" } // this is repeated because only the first one has to exist (one word minimum)
                        )
                    ]
                }
            ]
        }
    ],

    execute (message, args) {
        const timeString = args[0];
        const reminderMessage = args.slice(1).join(" ");

        if (reminderMessage === undefined || reminderMessage === "") {
            message.channel.send("You must set a reminder message. Usage: <time> <message>.");
            return;
        }

        const timeRegex = /(?:0*(\d+)d)?(?:0*((?:\d)|(?:1\d)|(?:2[0-3]))h)?(?:0*((?:\d)|(?:[1-5]\d))m)?(?:0*((?:\d)|(?:[1-5]\d))s)?/;


        const match = timeString.match(timeRegex);

        if (match[0] !== timeString) {
            message.channel.send("Invalid time. Format: 0d0h0m0s. Hours can be between 0 and 23, minutes and seconds between 0 and 60.");
            return;
        }

        const days = Number.parseInt(match[1]) || 0;
        const hours = Number.parseInt(match[2]) || 0;
        const minutes = Number.parseInt(match[3]) || 0;
        const seconds = Number.parseInt(match[4]) || 0;

        setTimeout(() => {
            message.reply(`Reminder: ${reminderMessage}`);
        }, seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000 + days * 24 * 60 * 60 * 1000);

        message.channel.send(`Set reminder in ${days} day${plural(days)}, ${hours} hour${plural(hours)}, ${minutes} minute${plural(minutes)}, ${seconds} second${plural(seconds)}.`);

    }
};
