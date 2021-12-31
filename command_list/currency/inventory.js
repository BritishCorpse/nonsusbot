const { getUserItems } = require(`${__basedir}/functions`);


module.exports = {
    name: 'inventory',
    description: "Shows your inventory, or someone else's.",

    usage: [
        { tag: "nothing" },
        { tag: "user", checks: {isuseringuild: null} }
    ],

    async execute (message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        const items = await getUserItems(targetUser.id);

        if (items.length === 0) {
            message.channel.send(`${targetUser.tag} has nothing!`);
            return;
        }

        message.channel.send(`${targetUser.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);
    }
}
