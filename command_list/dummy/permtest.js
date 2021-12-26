module.exports = {
    name: 'paginatortest',
    description: "test paginator",
    userPermissions: ['MANAGE_CHANNELS'],
    execute (message, args) {
        message.channel.send('the command executed');
    }
}
