module.exports = {
    name: 'leaderboard',
    category: "Currency",
    description: "Displays the richest users on the leaderboard.",
    execute (message, args) {
        message.channel.send(
            message.client.currency.sort((a, b) => b.balance - a.balance)
                .filter(user => message.client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(message.client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                .join('\n'), {
                    code: true
                }
        );
    }
}
