module.exports = {
    name: 'permtest',
    description: "test permissions check",
    userPermissions: ['MANAGE_CHANNELS', "ADMINISTRATOR", "VIEW_CHANNEL"],
    developer: true,
    execute (message, args) {
        message.channel.send('the command executed');
    }
}