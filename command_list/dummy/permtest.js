module.exports = {
    name: 'permtest',
    description: "test permissions check",
    userPermissions: ['ADMINISTRATOR'],
    developer: true,
    execute (message, args) {
        message.channel.send('the command executed');
    }
}
