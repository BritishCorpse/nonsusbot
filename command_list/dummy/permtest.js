module.exports = {
    name: 'permtest',
    description: "test permissions check",
    userPermissions: ['ADMINISTRATOR'],
    execute (message, args) {
        message.channel.send('the command executed');
    }
}
