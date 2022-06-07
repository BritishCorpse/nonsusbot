module.exports = {
    name: ["nsfwcheck"],
    description: "Test the NSFW checking mechanism",
    developer: true,
    nsfw: true,
    async execute(message) {
        message.channel.send("Command ran (channel is nsfw).");
    }
};
