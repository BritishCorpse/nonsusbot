module.exports = {
    name: "nsfwcheck",
    description: "Test the NSFW checking mechanism",
    developer: true,
    nsfw: true,
    execute(message, args) {
        message.channel.send("Command ran (channel is nsfw).");
    }
};
