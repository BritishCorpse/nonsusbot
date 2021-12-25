module.exports = {
    name: "restart",
	  description: "Restarts the bot.",
    op: true,
  	execute (message, args) {
        message.channel.send("Restarting the bot...")
        .then(() => {
            process.on("exit", () => {
                require("child_process").spawn(process.argv.shift(), process.argv, {
                    cwd: process.cwd(),
                    detached: true,
                    stdio: "inherit"
                });
            });
            process.exit();
        });
    }
};
