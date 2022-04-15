module.exports = {
    name: ["restart", "exit"],
    description: "Exits the bot if youre not using PM2.",
    developer: true,
    
    usage: [
    ],

    async execute (message) {
        message.channel.send("Restarting the bot.")
            .then(() => {
                process.exit();
            });
    }
};
