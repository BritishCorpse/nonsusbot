module.exports = {
    name: "exit",
    description: "Shuts down the bot.",
    developer: true,
    
    usage: [
    ],

    async execute (message) {
        message.channel.send("Shutting down the bot...")
            .then(() => {
                process.exit();
            });
    }
};
