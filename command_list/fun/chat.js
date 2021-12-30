const request = require("request");

// create circular usage for infinite arguments
let usage = [
    { tag: "message", checks: {matches: {not: /[^\w?!.,;:'"\(\)\/]/}},
        next: []
    }
];
usage[0].next = usage;

module.exports = {
    name: "chat",
    description: "Talk with an AI!",

    usage,

    execute (message, args) {
        if (/@/m.test(args.join(" "))) {
            message.channel.send("No no nooo, very baaad! :poop:");
            return;
        }

        request("https://api.affiliateplus.xyz/api/chatbot?message=" + args.join(" ") + "&botname=kekbot&ownername=kekbot_owner&user=" + message.channel.id, (error, response, body) => {
            const parsedBody = JSON.parse(body);
            message.channel.send(parsedBody.message);
        });
    }
}
