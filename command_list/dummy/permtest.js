module.exports = {
    name: ["permtest"],
    description: "test permissions check",
    botPermissions: ["ADMINISTRATOR"],
    userPermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR", "VIEW_CHANNEL"],
    developer: true,

    usage: [
    ],

    async execute (message) {
        message.channel.send("the command executed");
    }
};
