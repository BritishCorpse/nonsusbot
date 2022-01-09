/* eslint-disable no-unreachable */
module.exports = {
    name: "restart",
    description: "Restarts the bot.",
    developer: true,

    usage: [
    ],

    execute (message) {
        message.channel.send(`Command disabled due to using pm2. Use ${message.client.serverConfig.get(message.guild.id).prefix}exit instead.`);
        return;

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
