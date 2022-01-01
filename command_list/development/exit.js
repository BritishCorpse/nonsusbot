module.exports = {
    name: "exit",
    description: "Shuts down the bot.",
    developer: true,
    
    usage: [
    ],

    execute (message, args) {
        message.channel.send("Shutting down the bot...")
        .then(() => {
            process.exit();
        });
    }
};
