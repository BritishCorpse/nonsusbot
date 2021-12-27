module.exports = {
    name: 'levelup',
    execute(client) {
        client.on('message', message => {
            const channel = client.channels.cache.get("869030517419417630");

            if (message.guild === null || message.author.bot) return;

            if (message.channel.id !== channel.id) return console.log("no");

            message.channel.send("Good job! I'm proud.")
        })

    }
}