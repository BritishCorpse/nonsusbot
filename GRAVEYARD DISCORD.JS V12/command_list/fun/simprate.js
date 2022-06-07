const { userMention } = require("@discordjs/builders");

module.exports = {
    name: ["simprate"],
    description: "See how much a user is a simp!",

    usage: [
        { tag: "user", checks: {isuseridinguild: null},
        }
    ],
    execute(message) {
        const user = message.mentions.users.first();

        const rate = Math.floor(Math.random() * 100);

        message.channel.send(`${userMention(user.id)} is ${rate}% a simp!`);
    }
};