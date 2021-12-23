module.exports = {
    name: "exit",
    category: "Development",
    description: "Shuts down the bot.",
    op: true,
    execute (message, args) {
        message.channel.send("Shutting down the bot...")
        .then(() => {
            process.exit();
        });
    }
};
